
import React, { useState, ChangeEvent, useMemo, useRef } from 'react';
import { Order, OrderStatus, Product, ProductCategory } from '../types';
import { Invoice } from './Invoice';

const AdminDashboard: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
        const deliveredOrders = orders.filter(o => o.status === OrderStatus.Delivered);
        const pendingOrders = orders.filter(o => o.status === OrderStatus.Pending);
        
        const productSales: Record<string, number> = {};
        orders.forEach(o => {
            o.items.forEach(item => {
                productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
            });
        });
        
        const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];

        return {
            totalSales,
            deliveredCount: deliveredOrders.length,
            pendingCount: pendingOrders.length,
            totalCount: orders.length,
            topProduct: topProduct ? { name: topProduct[0], quantity: topProduct[1] } : null
        };
    }, [orders]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Revenue</span>
                    <p className="text-3xl font-black text-dark mt-2">Rs. {stats.totalSales.toLocaleString()}</p>
                    <div className="mt-4 flex items-center text-[10px] text-primary font-black uppercase">
                        <span className="bg-primary/10 px-2 py-0.5 rounded">↑ Live</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Orders</span>
                    <p className="text-3xl font-black text-dark mt-2">{stats.totalCount}</p>
                    <div className="mt-4 flex items-center text-[10px] text-blue-500 font-black uppercase">
                        <span className="bg-blue-50 px-2 py-0.5 rounded">{stats.pendingCount} Pending</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Stock</span>
                    <p className="text-3xl font-black text-dark mt-2">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Best Seller</span>
                    <p className="text-lg font-black text-dark mt-2 leading-tight truncate">
                        {stats.topProduct ? stats.topProduct.name : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-premium border border-gray-100">
                <h3 className="text-lg font-black text-dark mb-8 flex items-center">
                    <div className="w-2 h-6 bg-primary rounded-full mr-3"></div>
                    Catalog Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {Object.values(ProductCategory).map(cat => (
                         <div key={cat} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{cat}</p>
                             <p className="text-xl font-black text-dark mt-1">{products.filter(p => p.category === cat).length}</p>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

interface AdminViewProps {
    orders: Order[];
    products: Product[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProductExplicit: (productId: number) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
    orders, 
    products, 
    updateOrderStatus, 
    addProduct, 
    updateProduct, 
    deleteProductExplicit 
}) => {
    const [tab, setTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [proofToView, setProofToView] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');
    
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSyncing(true);
        setSyncMessage('Syncing with Server...');
        
        const productData = { 
            ...newProduct, 
            id: editingProduct ? editingProduct.id : Date.now()
        } as Product;

        if (editingProduct) {
            updateProduct(productData);
        } else {
            addProduct(productData);
        }
        
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setNewProduct({ name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: '' });
        
        setTimeout(() => {
            setIsSyncing(false);
            setSyncMessage('');
        }, 1500);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setIsSyncing(true);
            setSyncMessage('Removing Item...');
            deleteProductExplicit(id);
            setTimeout(() => {
                setIsSyncing(false);
                setSyncMessage('');
            }, 1500);
        }
    };

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        setIsSyncing(true);
        setSyncMessage('Updating Order...');
        updateOrderStatus(orderId, status);
        setTimeout(() => {
            setIsSyncing(false);
            setSyncMessage('');
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-dark tracking-tight">Admin Console</h2>
                    <p className="text-gray-400 text-sm mt-1 font-medium">TazaMart Portal</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl shadow-premium border border-gray-100">
                    <button onClick={() => setTab('dashboard')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'dashboard' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>Stats</button>
                    <button onClick={() => setTab('orders')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'orders' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>Orders</button>
                    <button onClick={() => setTab('products')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'products' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>Inventory</button>
                </div>
            </div>

            {isSyncing && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-white px-6 py-3 rounded-2xl shadow-premium border border-primary/20 flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{syncMessage}</span>
                </div>
            )}

            {tab === 'dashboard' && <AdminDashboard orders={orders} products={products} />}

            {tab === 'orders' && (
                <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <th className="p-6">Order ID</th>
                                    <th className="p-6">Customer</th>
                                    <th className="p-6">Total</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.slice().reverse().map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                        <td className="p-6 font-black text-gray-400">#{order.id.split('-').pop()}</td>
                                        <td className="p-6">
                                            <div className="font-black text-dark">{order.customer.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{order.customer.phone}</div>
                                        </td>
                                        <td className="p-6 font-black text-primary">Rs. {order.total.toLocaleString()}</td>
                                        <td className="p-6">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg outline-none
                                                    ${order.status === OrderStatus.Pending ? 'bg-yellow-50 text-yellow-600' : 
                                                      order.status === OrderStatus.Packed ? 'bg-blue-50 text-blue-600' : 
                                                      'bg-green-50 text-green-600'}`}
                                            >
                                                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-6 text-right space-x-2">
                                            <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-dark transition-all">
                                                <span className="material-symbols-rounded text-[20px]">print</span>
                                            </button>
                                            <button onClick={() => setProofToView(order.paymentProof)} className="p-2.5 bg-primary/5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all">
                                                <span className="material-symbols-rounded text-[20px]">open_in_new</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'products' && (
                <div className="space-y-6">
                    <button 
                        onClick={() => { setEditingProduct(null); setNewProduct({ name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: '' }); setIsProductModalOpen(true); }} 
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-premium hover:shadow-lg transition-all"
                    >
                        <span className="material-symbols-rounded mr-3">add</span> Add New Item
                    </button>

                    <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <tr>
                                        <th className="p-6">Item</th>
                                        <th className="p-6">Category</th>
                                        <th className="p-6">Price</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50/30 transition-colors text-sm">
                                            <td className="p-6 flex items-center space-x-4">
                                                <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-soft" alt={p.name} referrerPolicy="no-referrer" onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100?text=No+Img'} />
                                                <span className="font-black text-dark">{p.name}</span>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-lg text-gray-500">{p.category}</span>
                                            </td>
                                            <td className="p-6 font-black text-dark">Rs. {p.price} / {p.unit}</td>
                                            <td className="p-6 text-right space-x-2">
                                                <button onClick={() => { setEditingProduct(p); setNewProduct(p); setIsProductModalOpen(true); }} className="p-2.5 text-primary bg-primary/5 rounded-xl hover:bg-primary hover:text-white transition-all">
                                                    <span className="material-symbols-rounded text-lg">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                    <span className="material-symbols-rounded text-lg">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Add/Edit Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-premium overflow-y-auto max-h-[90vh] no-scrollbar animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black text-dark">{editingProduct ? 'Edit Item' : 'Add Item'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-dark">
                                <span className="material-symbols-rounded text-2xl">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Product Name</label>
                                <input required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Red Apples" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Price (Rs)</label>
                                    <input required type="number" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Unit</label>
                                    <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value as any})}>
                                        <option value="kg">Per kg</option>
                                        <option value="piece">Per piece</option>
                                        <option value="bundle">Per bundle</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Category</label>
                                <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                                    {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Item Image</label>
                                <div className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 transition-all cursor-pointer relative" onClick={() => fileInputRef.current?.click()}>
                                    {newProduct.image ? (
                                        <div className="text-center">
                                            <img src={newProduct.image} className="h-32 w-auto rounded-xl shadow-lg mx-auto object-cover mb-4" alt="Preview" referrerPolicy="no-referrer" />
                                            <p className="text-[10px] font-black text-primary uppercase">Tap to change image</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <span className="material-symbols-rounded text-4xl text-gray-300">add_photo_alternate</span>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Upload Image (JPG/PNG)</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Description</label>
                                <textarea className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-24 no-scrollbar" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Item details..." />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest bg-gray-100 text-gray-400">Discard</button>
                                <button type="submit" className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest bg-primary text-white shadow-premium">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedOrder && <Invoice order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            
            {proofToView && (
                <div className="fixed inset-0 bg-dark/90 backdrop-blur-md flex items-center justify-center z-[101] p-4" onClick={() => setProofToView(null)}>
                    <div className="bg-white rounded-3xl p-4 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <img src={proofToView} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" alt="Proof" />
                    </div>
                </div>
            )}
        </div>
    );
};
