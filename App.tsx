
import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Skeleton } from './components/ui';
import { BottomNav } from './components/BottomNav.tsx';
import { HomeView } from './components/HomeView.tsx';
import { CartView } from './components/CartView.tsx';
import { CheckoutView } from './components/CheckoutView.tsx';
import { OrderConfirmationView } from './components/OrderConfirmationView.tsx';
import { OrderHistoryView } from './components/OrderHistoryView.tsx';
import { AdminView } from './components/AdminView.tsx';
import { AdminLoginView } from './components/AdminLoginView.tsx';
import { ProductDetailView } from './components/ProductDetailView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { FavoritesView } from './components/FavoritesView.tsx';
import { Product, CartItem, Order, OrderStatus, View, Language, Theme, UserProfile, AppPage } from './types.ts';
import { initialProducts, initialPages } from './data.ts';
import { PageView } from './components/PageView.tsx';
import { config, migrateStorageKeys, ADMIN_PATH } from './lib/config';
import { api, session, SECURE_BACKEND, AuthError } from './lib/api';


type AppState = {
    products: Product[];
    cart: CartItem[];
    orders: Order[]; // Customer's local orders
    remoteOrders: Order[]; // Admin's orders from GSheet
    favorites: number[]; // IDs of favorite products
    profile: UserProfile;
    language: Language;
    theme: Theme;
    isLoading: boolean;
    pages: AppPage[];
};

type Action =
    | { type: 'SET_REMOTE_DATA'; payload: { products: Product[], orders: Order[] } }
    | { type: 'SET_INITIAL_STATE'; payload: Partial<AppState> }
    | { type: 'SET_PRODUCTS'; payload: Product[] }
    | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
    | { type: 'TOGGLE_FAVORITE'; payload: number }
    | { type: 'UPDATE_PROFILE'; payload: UserProfile }
    | { type: 'SET_LANGUAGE'; payload: Language }
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'PLACE_ORDER'; payload: Order }
    | { type: 'CLEAR_CART' }
    | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
    | { type: 'UPDATE_PAGE'; payload: AppPage }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_REMOTE_ORDERS'; payload: Order[] }
    | { type: 'RENAME_ORDER'; payload: { from: string; to: string } }
    | { type: 'SET_LOCAL_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } };

const appReducer = (state: AppState, action: Action): AppState => {
    let newState: AppState = { ...state };
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_REMOTE_DATA':
            // Update products and admin-only remote orders
            newState = { ...state, products: action.payload.products, remoteOrders: action.payload.orders, isLoading: false };
            break;
        case 'SET_REMOTE_ORDERS':
            return { ...state, remoteOrders: action.payload };
        case 'RENAME_ORDER':
            newState = { ...state, orders: state.orders.map(o => o.id === action.payload.from ? { ...o, id: action.payload.to } : o) };
            break;
        case 'SET_LOCAL_ORDER_STATUS':
            newState = { ...state, orders: state.orders.map(o => o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o) };
            break;
        case 'SET_INITIAL_STATE':
            newState = { ...state, ...action.payload };
            break;
        case 'SET_PRODUCTS':
            newState = { ...state, products: action.payload };
            break;
        case 'TOGGLE_FAVORITE':
            const favorites = state.favorites.includes(action.payload)
                ? state.favorites.filter(id => id !== action.payload)
                : [...state.favorites, action.payload];
            newState = { ...state, favorites };
            break;
        case 'UPDATE_PROFILE':
            newState = { ...state, profile: action.payload };
            break;
        case 'SET_LANGUAGE':
            newState = { ...state, language: action.payload };
            break;
        case 'SET_THEME':
            newState = { ...state, theme: action.payload };
            break;
        case 'ADD_TO_CART': {
            const { product, quantity } = action.payload;
            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                const newQuantity = parseFloat((existingItem.quantity + quantity).toFixed(2));
                newState = {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === product.id ? { ...item, quantity: newQuantity } : item
                    ),
                };
            } else {
                newState = { ...state, cart: [...state.cart, { ...product, quantity }] };
            }
            break;
        }
        case 'REMOVE_FROM_CART':
            newState = { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
            break;
        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                 newState = { ...state, cart: state.cart.filter(item => item.id !== action.payload.productId) };
            } else {
                newState = {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item
                    ),
                };
            }
            break;
        }
        case 'PLACE_ORDER':
            // Add strictly to the user's local order list
            newState = { ...state, orders: [...state.orders, action.payload] };
            break;
        case 'CLEAR_CART':
            newState = { ...state, cart: [] };
            break;
        case 'UPDATE_ORDER_STATUS':
            // Update remote orders list for admin view
            newState = {
                ...state,
                remoteOrders: state.remoteOrders.map(order =>
                    order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order
                ),
                // If it's the user's own order, update the local status too
                orders: state.orders.map(order =>
                    order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order
                ),
            };
            break;
        case 'UPDATE_PAGE':
            const exists = state.pages.some(p => p.slug === action.payload.slug);
            newState = {
                ...state,
                pages: exists 
                    ? state.pages.map(p => p.slug === action.payload.slug ? action.payload : p)
                    : [...state.pages, action.payload]
            };
            break;
        default:
            return state;
    }

    localStorage.setItem('vegelo_products_cache', JSON.stringify(newState.products));
    localStorage.setItem('vegelo_orders', JSON.stringify(newState.orders));
    localStorage.setItem('vegelo_favorites', JSON.stringify(newState.favorites));
    localStorage.setItem('vegelo_profile', JSON.stringify(newState.profile));
    localStorage.setItem('vegelo_lang', newState.language);
    localStorage.setItem('vegelo_theme', newState.theme);
    localStorage.setItem('vegelo_pages', JSON.stringify(newState.pages));
    return newState;
};

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, {
        products: [],
        cart: [],
        orders: [],
        remoteOrders: [],
        favorites: [],
        profile: { name: '', address: '', phone: '' },
        language: Language.EN,
        theme: Theme.Light,
        isLoading: true,
        pages: initialPages
    });

    const [view, setView] = useState<View>(View.Home);
    const [isAuthenticated, setIsAuthenticated] = useState(() => SECURE_BACKEND && !!session.get());
    const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        // Set document language to English to trigger browser translation for non-English users
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
    }, []);

    useEffect(() => { window.scrollTo({ top: 0 }); }, [view]);

    const loadAdminOrders = useCallback(async () => {
        if (!SECURE_BACKEND || !session.get()) return;
        try {
            dispatch({ type: 'SET_REMOTE_ORDERS', payload: await api.listOrders() });
        } catch (err) {
            if (err instanceof AuthError) { setIsAuthenticated(false); setView(View.AdminLogin); }
            else console.warn('Loading orders failed.', err);
        }
    }, []);

    const fetchRemoteData = useCallback(async () => {
        try {
            const { products, orders } = await api.fetchCatalogue();
            if (products) {
                // Only update products and remoteOrders (admin) - leave user local orders alone
                dispatch({ type: 'SET_REMOTE_DATA', payload: { products, orders } });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
            loadAdminOrders();
        } catch (err) {
            console.warn("Sync failed.", err);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [loadAdminOrders]);

    useEffect(() => {
        migrateStorageKeys();
        const storedOrders = localStorage.getItem('vegelo_orders');
        const cachedProducts = localStorage.getItem('vegelo_products_cache');
        const storedFavs = localStorage.getItem('vegelo_favorites');
        const storedProfile = localStorage.getItem('vegelo_profile');
        const storedLang = localStorage.getItem('vegelo_lang') as Language;
        const storedTheme = localStorage.getItem('vegelo_theme') as Theme;
        const storedPages = localStorage.getItem('vegelo_pages');

        // Admin portal is only reachable at its dedicated path (and only when enabled)
        const path = window.location.pathname.replace(/\/+$/, '');
        if (config.adminEnabled && path === ADMIN_PATH) {
            setIsAdminUnlocked(true);
            setView(View.AdminLogin);
        }

        dispatch({ 
            type: 'SET_INITIAL_STATE', 
            payload: {
                products: cachedProducts ? JSON.parse(cachedProducts) : initialProducts,
                orders: storedOrders ? JSON.parse(storedOrders).map((o: any) => ({...o, orderDate: new Date(o.orderDate)})) : [],
                favorites: storedFavs ? JSON.parse(storedFavs) : [],
                profile: storedProfile ? JSON.parse(storedProfile) : { name: '', address: '', phone: '' },
                language: storedLang || Language.EN,
                theme: storedTheme || Theme.Light,
                pages: storedPages ? JSON.parse(storedPages) : initialPages
            }
        });

        fetchRemoteData();
    }, [fetchRemoteData]);

    useEffect(() => {
        if (state.theme === Theme.Dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.theme]);

    const syncToRemote = async (action: 'add' | 'edit' | 'delete' | 'updateOrderStatus', data: Record<string, unknown>) => {
        try {
            await api.adminWrite(action, data);
        } catch (err) {
            if (err instanceof AuthError) { setIsAuthenticated(false); setView(View.AdminLogin); alert('Your admin session expired. Please sign in again.'); return; }
            console.error("Remote sync failed:", err);
            alert('Saving to the server failed. Please try again.');
        }
        setTimeout(() => { fetchRemoteData(); }, 1000);
    };

    const onAddToCart = (product: Product, quantity: number) => dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    const onRemoveFromCart = (productId: number) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    const onUpdateQuantity = (productId: number, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    const toggleFavorite = (productId: number) => dispatch({ type: 'TOGGLE_FAVORITE', payload: productId });
    const updateProfile = (profile: UserProfile) => dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    const setLanguage = (lang: Language) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
    const setTheme = (theme: Theme) => dispatch({ type: 'SET_THEME', payload: theme });
    
    const onPlaceOrder = (order: Order) => {
        const orderForBackend = { ...order, paymentProofBase64: order.paymentProof };
        dispatch({ type: 'PLACE_ORDER', payload: order });
        setLastOrder(order);
        dispatch({ type: 'CLEAR_CART' });
        api.addOrder(orderForBackend as unknown as Record<string, unknown>)
            .then(serverId => {
                if (serverId && serverId !== order.id) {
                    dispatch({ type: 'RENAME_ORDER', payload: { from: order.id, to: serverId } });
                    setLastOrder(o => (o && o.id === order.id ? { ...o, id: serverId } : o));
                }
            })
            .catch(err => { console.error('Order submit failed', err); alert('We could not reach the server. Please check your connection and contact us with your order details.'); });
    };

    const onUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
        syncToRemote('updateOrderStatus', { orderId, status });
    };
    
    const onAddProduct = (product: Product) => {
        const productForBackend = { ...product, id: product.id.toString(), price: product.price.toString(), imageBase64: product.image };
        syncToRemote('add', { product: productForBackend });
    };
    
    const onUpdateProduct = (product: Product) => {
        const productForBackend = { ...product, id: product.id.toString(), price: product.price.toString(), imageBase64: product.image.startsWith('data:') ? product.image : undefined };
        syncToRemote('edit', { product: productForBackend });
    };
    
    const onDeleteProduct = (productId: number) => {
        syncToRemote('delete', { id: productId.toString() });
    };

    const onUpdatePage = (page: AppPage) => {
        dispatch({ type: 'UPDATE_PAGE', payload: page });
        // Optional: Sync to remote if pages are stored there too
    };
    
    const refreshOrderStatuses = async () => {
        if (!SECURE_BACKEND) return;
        await Promise.all(state.orders.map(async o => {
            const remote = await api.lookupOrder(o.id, o.customer.phone);
            if (remote && remote.status !== o.status) dispatch({ type: 'SET_LOCAL_ORDER_STATUS', payload: { orderId: o.id, status: remote.status } });
        }));
    };

    const onAdminLogin = () => { setIsAuthenticated(true); setView(View.Admin); loadAdminOrders(); };
    const onAdminLogout = () => { api.logout(); setIsAuthenticated(false); dispatch({ type: 'SET_REMOTE_ORDERS', payload: [] }); setView(View.AdminLogin); };

    const clearLocalData = () => {
        try {
            Object.keys(localStorage).filter(k => k.startsWith('vegelo_') && k !== 'vegelo_products_cache' && k !== 'vegelo_theme').forEach(k => localStorage.removeItem(k));
        } catch { /* ignore */ }
        dispatch({ type: 'SET_INITIAL_STATE', payload: { orders: [], favorites: [], cart: [], profile: { name: '', address: '', phone: '' } } });
        setView(View.Home);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setView(View.ProductDetail);
    };

    const renderView = () => {
        if (state.isLoading && view === View.Home && state.products.length === 0) {
            return (
                <div className="px-4 md:px-0 pt-8" aria-busy="true" aria-label="Loading fresh stock">
                    <Skeleton className="h-56 md:h-72 rounded-3xl" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-8">
                        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}
                    </div>
                </div>
            );
        }

        switch (view) {
            case View.Home:
                return <HomeView lang={state.language} products={state.products} onAddToCart={onAddToCart} onProductClick={handleProductClick} />;
            case View.ProductDetail:
                if (!selectedProduct) return <HomeView lang={state.language} products={state.products} onAddToCart={onAddToCart} onProductClick={handleProductClick} />;
                return <ProductDetailView lang={state.language} product={selectedProduct} isFavorite={state.favorites.includes(selectedProduct.id)} toggleFavorite={toggleFavorite} onAddToCart={onAddToCart} onBack={() => setView(View.Home)} />;
            case View.Cart:
                return <CartView lang={state.language} cart={state.cart} updateQuantity={onUpdateQuantity} removeFromCart={onRemoveFromCart} setView={setView} />;
            case View.Checkout:
                return <CheckoutView lang={state.language} profile={state.profile} cart={state.cart} placeOrder={onPlaceOrder} setView={setView} />;
            case View.AboutUs:
                const aboutPage = state.pages.find(p => p.slug === 'about-us') || initialPages[0];
                return <PageView title={aboutPage.title} content={aboutPage.content} onBack={() => setView(View.Home)} />;
            case View.Terms:
                const termsPage = state.pages.find(p => p.slug === 'terms-and-conditions') || initialPages[1];
                return <PageView title={termsPage.title} content={termsPage.content} onBack={() => setView(View.Home)} />;
            case View.ReturnPolicy:
                const returnPage = state.pages.find(p => p.slug === 'return-policy') || initialPages[2];
                return <PageView title={returnPage.title} content={returnPage.content} onBack={() => setView(View.Home)} />;
            case View.ContactUs:
                const contactPage = state.pages.find(p => p.slug === 'contact-us') || initialPages[3];
                return <PageView title={contactPage.title} content={contactPage.content} onBack={() => setView(View.Home)} />;
            case View.Confirmation:
                return <OrderConfirmationView lang={state.language} lastOrder={lastOrder} setView={setView} />;
            case View.OrderHistory:
                // consumption of strictly local orders
                return <OrderHistoryView lang={state.language} orders={state.orders} onRefresh={SECURE_BACKEND ? refreshOrderStatuses : undefined} lookupOrder={SECURE_BACKEND ? api.lookupOrder : undefined} />;
            case View.Favorites:
                return <FavoritesView 
                    lang={state.language} 
                    favorites={state.products.filter(p => state.favorites.includes(p.id))} 
                    onAddToCart={onAddToCart} 
                    onProductClick={handleProductClick} 
                    setView={setView}
                />;
            case View.Profile:
                return <ProfileView
                    profile={state.profile}
                    updateProfile={updateProfile}
                    lang={state.language}
                    setView={setView}
                    theme={state.theme}
                    setTheme={setTheme}
                    setLanguage={setLanguage}
                    ordersCount={state.orders.length}
                    favoritesCount={state.favorites.length}
                    onClearData={clearLocalData}
                />;
            case View.AdminLogin:
                if (!config.adminEnabled) return <HomeView lang={state.language} products={state.products} onAddToCart={onAddToCart} onProductClick={handleProductClick} />;
                return <AdminLoginView onLogin={onAdminLogin} />;
            case View.Admin:
                return config.adminEnabled && isAuthenticated ? (
                    // consumption of strictly remote orders for admin
                    <AdminView orders={state.remoteOrders} products={state.products} pages={state.pages} updateOrderStatus={onUpdateOrderStatus} addProduct={onAddProduct} updateProduct={onUpdateProduct} deleteProductExplicit={onDeleteProduct} updatePage={onUpdatePage} onLogout={onAdminLogout} onRefresh={fetchRemoteData} loadProof={SECURE_BACKEND ? api.getPaymentProof : undefined} />
                ) : (
                    <AdminLoginView onLogin={onAdminLogin} />
                );
            default:
                return <HomeView lang={state.language} products={state.products} onAddToCart={onAddToCart} onProductClick={handleProductClick} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark text-ink dark:text-stone-100">
            <Header 
                lang={state.language}
                theme={state.theme}
                setLanguage={setLanguage}
                setTheme={setTheme}
                cartItemCount={state.cart.reduce((c, i) => c + i.quantity, 0)} 
                setView={setView}
                currentView={view}
            />
            <main className="flex-grow pb-24 md:pb-0 max-w-7xl mx-auto w-full px-0 md:px-8">
                {renderView()}
            </main>
            {view !== View.Admin && <Footer setView={setView} />}
            {view !== View.ProductDetail && (
                <BottomNav 
                    currentView={view} 
                    setView={setView} 
                    cartCount={state.cart.reduce((c, i) => c + i.quantity, 0)}
                    lang={state.language}
                    isAdminUnlocked={isAdminUnlocked}
                />
            )}
        </div>
    );
};

export default App;
