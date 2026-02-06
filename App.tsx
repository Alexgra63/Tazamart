
import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AdminView } from './components/AdminView';
import { AdminLoginView } from './components/AdminLoginView';
import { ProductDetailView } from './components/ProductDetailView';
import { Product, CartItem, Order, OrderStatus, View } from './types';
import { initialProducts } from './data';

type AppState = {
    products: Product[];
    cart: CartItem[];
    orders: Order[];
};

type Action =
    | { type: 'SET_INITIAL_STATE'; payload: AppState }
    | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
    | { type: 'PLACE_ORDER'; payload: Order }
    | { type: 'CLEAR_CART' }
    | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
    | { type: 'ADD_PRODUCT'; payload: Product }
    | { type: 'UPDATE_PRODUCT'; payload: Product }
    | { type: 'DELETE_PRODUCT'; payload: number };

const appReducer = (state: AppState, action: Action): AppState => {
    let newState: AppState;
    switch (action.type) {
        case 'SET_INITIAL_STATE':
            return action.payload;
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

    // Persist only products and orders to local storage "DB"
    localStorage.setItem('tazamart_products', JSON.stringify(newState.products));
    localStorage.setItem('tazamart_orders', JSON.stringify(newState.orders));
    return newState;
};

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, {
        products: initialProducts,
        cart: [],
        orders: [],
    });

    const [view, setView] = useState<View>(View.Home);
    const [isAdminView, setIsAdminView] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Initial Load from "Database"
    useEffect(() => {
        const storedProducts = localStorage.getItem('tazamart_products');
        const storedOrders = localStorage.getItem('tazamart_orders');
        
        const initialState: AppState = {
            products: storedProducts ? JSON.parse(storedProducts) : initialProducts,
            cart: [], // Cart is usually session-based
            orders: storedOrders ? JSON.parse(storedOrders).map((o: any) => ({...o, orderDate: new Date(o.orderDate)})) : [],
        };
        
        dispatch({ type: 'SET_INITIAL_STATE', payload: initialState });
    }, []);

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
    const onAddProduct = (product: Product) => dispatch({ type: 'ADD_PRODUCT', payload: product });
    const onUpdateProduct = (product: Product) => dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    const onDeleteProduct = (productId: number) => dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    
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
        setIsAdminView(false);
        setView(newView);
        window.scrollTo(0, 0);
    };

    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Header 
                cartItemCount={cartItemCount} 
                setView={handleSetView} 
            />
            <main className="flex-grow pb-24">
                {renderView()}
            </main>
            <BottomNav 
                currentView={view} 
                setView={handleSetView} 
                isAdminView={isAdminView}
                setIsAdminView={setIsAdminView}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
};

export default App;
