
import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
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
import { Product, CartItem, Order, OrderStatus, View, Language, Theme, UserProfile } from './types.ts';
import { initialProducts } from './data.ts';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbytQbtCT4JNwAFrI_-7aDWoe2Ri1aSHJonO5BOLXRAb0P32DqBeWl9FWpgIuCpe7x0f/exec'; 

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
};

type Action =
    | { type: 'SET_REMOTE_DATA'; payload: { products: Product[], orders: Order[] } }
    | { type: 'SET_INITIAL_STATE'; payload: Partial<AppState> }
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
    | { type: 'SET_LOADING'; payload: boolean };

const appReducer = (state: AppState, action: Action): AppState => {
    let newState: AppState = { ...state };
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_REMOTE_DATA':
            // Update products and admin-only remote orders
            newState = { ...state, products: action.payload.products, remoteOrders: action.payload.orders, isLoading: false };
            break;
        case 'SET_INITIAL_STATE':
            newState = { ...state, ...action.payload };
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
        default:
            return state;
    }

    localStorage.setItem('tazamart_products_cache', JSON.stringify(newState.products));
    localStorage.setItem('tazamart_orders', JSON.stringify(newState.orders));
    localStorage.setItem('tazamart_favorites', JSON.stringify(newState.favorites));
    localStorage.setItem('tazamart_profile', JSON.stringify(newState.profile));
    localStorage.setItem('tazamart_lang', newState.language);
    localStorage.setItem('tazamart_theme', newState.theme);
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
        isLoading: true
    });

    const [view, setView] = useState<View>(View.Home);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchRemoteData = useCallback(async () => {
        try {
            const response = await fetch(GAS_API_URL, { 
                method: 'GET',
                cache: 'no-cache' 
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.products) {
                const products = data.products.map((p: any) => ({
                    ...p,
                    price: parseFloat(p.price),
                    id: isNaN(Number(p.id)) ? p.id : Number(p.id)
                }));
                const orders = (data.orders || []).map((o: any) => ({
                    ...o,
                    orderDate: new Date(o.orderDate)
                }));
                // Only update products and remoteOrders (admin) - leave user local orders alone
                dispatch({ type: 'SET_REMOTE_DATA', payload: { products, orders } });
            }
        } catch (err) {
            console.warn("Sync failed.", err);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    useEffect(() => {
        const storedOrders = localStorage.getItem('tazamart_orders');
        const cachedProducts = localStorage.getItem('tazamart_products_cache');
        const storedFavs = localStorage.getItem('tazamart_favorites');
        const storedProfile = localStorage.getItem('tazamart_profile');
        const storedLang = localStorage.getItem('tazamart_lang') as Language;
        const storedTheme = localStorage.getItem('tazamart_theme') as Theme;

        dispatch({ 
            type: 'SET_INITIAL_STATE', 
            payload: {
                products: cachedProducts ? JSON.parse(cachedProducts) : initialProducts,
                orders: storedOrders ? JSON.parse(storedOrders).map((o: any) => ({...o, orderDate: new Date(o.orderDate)})) : [],
                favorites: storedFavs ? JSON.parse(storedFavs) : [],
                profile: storedProfile ? JSON.parse(storedProfile) : { name: '', address: '', phone: '' },
                language: storedLang || Language.EN,
                theme: storedTheme || Theme.Light,
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

    const syncToRemote = async (action: string, data: any) => {
        try {
            await fetch(GAS_API_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action, ...data })
            });
            setTimeout(() => { fetchRemoteData(); }, 1000);
        } catch (err) {
            console.error("Remote sync failed:", err);
        }
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
        syncToRemote('addOrder', { order: orderForBackend });
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
    
    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setView(View.ProductDetail);
    };

    const renderView = () => {
        if (state.isLoading && view === View.Home && state.products.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] dark:text-gray-400">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing with Fresh Stock...</p>
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
            case View.Confirmation:
                return <OrderConfirmationView lang={state.language} lastOrder={lastOrder} setView={setView} />;
            case View.OrderHistory:
                // consumption of strictly local orders
                return <OrderHistoryView lang={state.language} orders={state.orders} />;
            case View.Favorites:
                return <FavoritesView lang={state.language} products={state.products.filter(p => state.favorites.includes(p.id))} onAddToCart={onAddToCart} onProductClick={handleProductClick} />;
            case View.Profile:
                return <ProfileView 
                    lang={state.language} 
                    theme={state.theme}
                    profile={state.profile} 
                    onSave={updateProfile} 
                    setLanguage={setLanguage}
                    setTheme={setTheme}
                />;
            case View.AdminLogin:
                return <AdminLoginView onLogin={() => { setIsAuthenticated(true); setView(View.Admin); }} />;
            case View.Admin:
                return isAuthenticated ? (
                    // consumption of strictly remote orders for admin
                    <AdminView orders={state.remoteOrders} products={state.products} updateOrderStatus={onUpdateOrderStatus} addProduct={onAddProduct} updateProduct={onUpdateProduct} deleteProductExplicit={onDeleteProduct} />
                ) : (
                    <AdminLoginView onLogin={() => { setIsAuthenticated(true); setView(View.Admin); }} />
                );
            default:
                return <HomeView lang={state.language} products={state.products} onAddToCart={onAddToCart} onProductClick={handleProductClick} />;
        }
    };

    return (
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${state.theme === Theme.Dark ? 'bg-dark' : 'bg-light'}`}>
            <Header 
                lang={state.language}
                theme={state.theme}
                setLanguage={setLanguage}
                setTheme={setTheme}
                cartItemCount={state.cart.reduce((c, i) => c + i.quantity, 0)} 
                setView={setView} 
                onUnlockAdmin={() => setIsAdminUnlocked(true)}
            />
            <main className="flex-grow pb-16">
                {renderView()}
            </main>
            <BottomNav 
                currentView={view} 
                setView={setView} 
                isAdminUnlocked={isAdminUnlocked}
            />
        </div>
    );
};

export default App;
