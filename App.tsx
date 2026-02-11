
import React, { useState, useReducer, useEffect } from 'react';
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
import { Product, CartItem, Order, OrderStatus, View } from './types.ts';
import { initialProducts } from './data.ts';

// THE DEPLOYED APPS SCRIPT URL PROVIDED BY THE USER
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbz04g4VCkvcThtGiXcoQ5e9qShkkTqvCH6-8F9ySeM6gwEbokPkj5-FsN2EcogoN9ga/exec'; 

type AppState = {
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    isLoading: boolean;
};

type Action =
    | { type: 'SET_PRODUCTS'; payload: Product[] }
    | { type: 'SET_INITIAL_STATE'; payload: Partial<AppState> }
    | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
    | { type: 'PLACE_ORDER'; payload: Order }
    | { type: 'CLEAR_CART' }
    | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
    | { type: 'ADD_PRODUCT'; payload: Product }
    | { type: 'UPDATE_PRODUCT'; payload: Product }
    | { type: 'DELETE_PRODUCT'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean };

const appReducer = (state: AppState, action: Action): AppState => {
    let newState: AppState = { ...state };
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_PRODUCTS':
            newState = { ...state, products: action.payload, isLoading: false };
            break;
        case 'SET_INITIAL_STATE':
            newState = { ...state, ...action.payload };
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
            newState = { ...state, orders: [...state.orders, action.payload] };
            break;
        case 'CLEAR_CART':
            newState = { ...state, cart: [] };
            break;
        case 'UPDATE_ORDER_STATUS':
            newState = {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order
                ),
            };
            break;
        case 'ADD_PRODUCT':
             newState = { ...state, products: [...state.products, action.payload] };
             break;
        case 'UPDATE_PRODUCT':
            newState = {
                ...state,
                products: state.products.map(p => (p.id === action.payload.id ? action.payload : p)),
            };
            break;
        case 'DELETE_PRODUCT':
            newState = {
                ...state,
                products: state.products.filter(p => p.id !== action.payload),
            };
            break;
        default:
            return state;
    }

    localStorage.setItem('vegelo_products_cache', JSON.stringify(newState.products));
    localStorage.setItem('vegelo_orders', JSON.stringify(newState.orders));
    return newState;
};

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, {
        products: [],
        cart: [],
        orders: [],
        isLoading: true
    });

    const [view, setView] = useState<View>(View.Home);
    const [isAdminView, setIsAdminView] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Initial Load from GAS and Cache
    useEffect(() => {
        const storedOrders = localStorage.getItem('vegelo_orders');
        const cachedProducts = localStorage.getItem('vegelo_products_cache');

        // Start with cache or initial data
        dispatch({ 
            type: 'SET_INITIAL_STATE', 
            payload: {
                products: cachedProducts ? JSON.parse(cachedProducts) : initialProducts,
                orders: storedOrders ? JSON.parse(storedOrders).map((o: any) => ({...o, orderDate: new Date(o.orderDate)})) : [],
            }
        });

        const fetchRemoteProducts = async () => {
            try {
                const response = await fetch(GAS_API_URL);
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    dispatch({ type: 'SET_PRODUCTS', payload: data });
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } catch (err) {
                console.error("Failed to sync with Google Sheets:", err);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        fetchRemoteProducts();
    }, []);

    const syncProductToRemote = async (action: 'add' | 'edit' | 'delete', data: any) => {
        try {
            // Note: We use the fetch API to trigger the Google Apps Script doPost.
            // Using 'no-cors' mode to ensure the request is sent despite common GAS redirect/CORS issues.
            await fetch(GAS_API_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...data })
            });
        } catch (err) {
            console.error("Sync error:", err);
        }
    };

    const cartItemCount = state.cart.reduce((count, item) => count + item.quantity, 0);

    const onAddToCart = (product: Product, quantity: number) => dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    const onRemoveFromCart = (productId: number) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    const onUpdateQuantity = (productId: number, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    
    const onPlaceOrder = (order: Order) => {
        dispatch({ type: 'PLACE_ORDER', payload: order });
        setLastOrder(order);
        dispatch({ type: 'CLEAR_CART' });
    };

    const onUpdateOrderStatus = (orderId: string, status: OrderStatus) => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    
    const onAddProduct = (product: Product) => {
        dispatch({ type: 'ADD_PRODUCT', payload: product });
        syncProductToRemote('add', { product });
    };
    
    const onUpdateProduct = (product: Product) => {
        dispatch({ type: 'UPDATE_PRODUCT', payload: product });
        syncProductToRemote('edit', { product });
    };
    
    const onDeleteProduct = (productId: number) => {
        dispatch({ type: 'DELETE_PRODUCT', payload: productId });
        syncProductToRemote('delete', { id: productId });
    };
    
    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsAdminView(false);
        setView(View.ProductDetail);
    };

    const handleAdminLogin = () => {
        setIsAuthenticated(true);
        setView(View.Admin);
    };

    const renderView = () => {
        if (state.isLoading && view === View.Home && state.products.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing with Fresh Stock...</p>
                </div>
            );
        }

        switch (view) {
            case View.Home:
                return <HomeView products={state.products} onAddToCart={onAddToCart} searchQuery={searchQuery} onProductClick={handleProductClick} />;
            case View.ProductDetail:
                if (!selectedProduct) return <HomeView products={state.products} onAddToCart={onAddToCart} searchQuery={searchQuery} onProductClick={handleProductClick} />;
                return <ProductDetailView product={selectedProduct} onAddToCart={onAddToCart} onBack={() => setView(View.Home)} />;
            case View.Cart:
                return <CartView cart={state.cart} updateQuantity={onUpdateQuantity} removeFromCart={onRemoveFromCart} setView={setView} />;
            case View.Checkout:
                return <CheckoutView cart={state.cart} placeOrder={onPlaceOrder} setView={setView} />;
            case View.Confirmation:
                return <OrderConfirmationView lastOrder={lastOrder} setView={setView} />;
            case View.OrderHistory:
                return <OrderHistoryView orders={state.orders} />;
            case View.AdminLogin:
                return <AdminLoginView onLogin={handleAdminLogin} />;
            case View.Admin:
                return isAuthenticated ? (
                    <AdminView 
                            orders={state.orders} 
                            products={state.products} 
                            updateOrderStatus={onUpdateOrderStatus} 
                            addProduct={onAddProduct}
                            updateProduct={onUpdateProduct}
                            deleteProduct={onDeleteProduct}
                        />
                ) : (
                    <AdminLoginView onLogin={handleAdminLogin} />
                );
            default:
                return <HomeView products={state.products} onAddToCart={onAddToCart} searchQuery={searchQuery} onProductClick={handleProductClick} />;
        }
    };

    const handleSetView = (newView: View) => {
        setIsAdminView(newView === View.Admin || newView === View.AdminLogin);
        setView(newView);
        window.scrollTo(0, 0);
    };

    const handleUnlockAdmin = () => {
        setIsAdminUnlocked(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Header 
                cartItemCount={cartItemCount} 
                setView={handleSetView} 
                onUnlockAdmin={handleUnlockAdmin}
            />
            <main className="flex-grow pb-16">
                {renderView()}
            </main>
            <BottomNav 
                currentView={view} 
                setView={handleSetView} 
                isAdminView={isAdminView}
                setIsAdminView={setIsAdminView}
                isAuthenticated={isAuthenticated}
                isAdminUnlocked={isAdminUnlocked}
            />
        </div>
    );
};

export default App;
