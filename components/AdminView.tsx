
import React, { useState, ChangeEvent } from 'react';
import { Order, OrderStatus, Product, ProductCategory } from '../types';
import { ExternalLinkIcon, PrintIcon, TrashIcon } from './Icons';
import { Invoice } from './Invoice';

// AdminDashboard Component
const AdminDashboard: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === OrderStatus.Pending).length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500">Total Orders</h3>
                <p className="text-3xl font-bold">{totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500">Pending Orders</h3>
                <p className="text-3xl font-bold">{pendingOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500">Total Sales</h3>
                <p className="text-3xl font-bold">Rs. {totalSales.toFixed(2)}</p>
            </div>
        </div>
    );
};

// AdminOrders Component
const AdminOrders: React.FC<{ orders: Order[], updateOrderStatus: (orderId: string, status: OrderStatus) => void }> = ({ orders, updateOrderStatus }) => {
    const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice().reverse().map(order => (
                            <tr key={order.id} className="border-b">
                                <td className="p-3 font-semibold">{order.id}</td>
                                <td className="p-3">{order.customer.name}</td>
                                <td className="p-3">Rs. {order.total.toFixed(2)}</td>
                                <td className="p-3">
                                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)} className="border-gray-300 rounded-md shadow-sm">
                                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="p-3 flex items-center space-x-2">
                                    <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 p-2" title="View Payment Proof"><ExternalLinkIcon className="h-5 w-5"/></a>
                                    <button onClick={() => setPrintingOrder(order)} className="text-gray-600 hover:text-gray-900 p-2" title="Print Invoice"><PrintIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {printingOrder && <Invoice order={printingOrder} onClose={() => setPrintingOrder(null)} />}
        </>
    );
};

// AdminProducts Component
const ProductForm: React.FC<{ product?: Product, onSave: (product: Product) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Product>(product || { id: Date.now(), name: '', price: 0, image: 'https://picsum.photos/400/300', category: ProductCategory.Vegetables, unit: 'kg' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
             <h3 className="text-xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required/>
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" required/>
                <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
                    {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded md:col-span-2" required/>
                 <select name="unit" value={formData.unit} onChange={handleChange} className="p-2 border rounded">
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="bundle">bundle</option>
                </select>
            </div>
            <div className="mt-4 flex space-x-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Save</button>
                <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
            </div>
        </form>
    )
}

const AdminProducts: React.FC<{ products: Product[], addProduct: (product: Product) => void, updateProduct: (product: Product) => void, deleteProduct: (productId: number) => void }> = ({ products, addProduct, updateProduct, deleteProduct }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleSave = (product: Product) => {
        if(editingProduct) {
            updateProduct(product);
        } else {
            addProduct(product);
        }
        setIsAdding(false);
        setEditingProduct(null);
    }

    return (
        <div>
            {isAdding || editingProduct ? (
                <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => { setIsAdding(false); setEditingProduct(null); }}/>
            ) : (
                <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-4 py-2 rounded-lg mb-4">Add Product</button>
            )}

            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left">
                     <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className="p-3 font-semibold">{product.name}</td>
                                <td className="p-3">{product.category}</td>
                                <td className="p-3">Rs. {product.price} / {product.unit}</td>
                                <td className="p-3">
                                    <button onClick={() => setEditingProduct(product)} className="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5 inline"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main AdminView Component
interface AdminViewProps {
    orders: Order[];
    products: Product[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
}

export const AdminView: React.FC<AdminViewProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-dark mb-8">Admin Panel</h2>
            <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 ${activeTab === 'dashboard' ? 'border-b-2 border-primary text-primary' : ''}`}>Dashboard</button>
                <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : ''}`}>Orders</button>
                <button onClick={() => setActiveTab('products')} className={`px-4 py-2 ${activeTab === 'products' ? 'border-b-2 border-primary text-primary' : ''}`}>Products</button>
            </div>
            <div>
                {activeTab === 'dashboard' && <AdminDashboard orders={props.orders} products={props.products} />}
                {activeTab === 'orders' && <AdminOrders orders={props.orders} updateOrderStatus={props.updateOrderStatus} />}
                {activeTab === 'products' && <AdminProducts {...props} />}
            </div>
        </div>
    );
};
