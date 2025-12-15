
export enum OrderStatus {
    Pending = 'Pending',
    Packed = 'Packed',
    Delivered = 'Delivered',
}

export enum ProductCategory {
    Vegetables = 'Vegetables',
    Fruits = 'Fruits',
    Bundles = 'Bundles',
    Seasonal = 'Seasonal Deals',
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: ProductCategory;
    unit: 'kg' | 'piece' | 'bundle';
    description?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Customer {
    name: string;
    address: string;
    phone: string;
}

export interface Order {
    id: string;
    customer: Customer;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    paymentMethod: 'Easypaisa' | 'JazzCash';
    paymentProof: string; // base64 string
    orderDate: Date;
}

export enum View {
    Home,
    Cart,
    Checkout,
    Confirmation,
    OrderHistory,
    Admin,
    AdminLogin,
    ProductDetail,
}
