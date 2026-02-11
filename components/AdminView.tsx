
import React, { useState, ChangeEvent, useMemo } from 'react';
import { Order, OrderStatus, Product, ProductCategory } from '../types';
import { ExternalLinkIcon, PrintIcon, TrashIcon, PlusIcon } from './Icons';
import { Invoice } from './Invoice';

// Helper to convert GDrive sharing links to direct image links
const formatGDriveLink = (link: string) => {
    if (!link) return '';
    if (link.includes('drive.google.com')) {
        const idMatch = link.match(/\/d\/(.+?)\//) || link.match(/id=(.+?)(&|$)/);
        if (idMatch && idMatch[1]) {
            return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
        }
    }
    return link;
};

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
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:shadow-premium transition-shadow">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Revenue</span>
                    <p className="text-3xl font-black text-dark mt-2">Rs. {stats.totalSales.toLocaleString()}</p>
                    <div className="mt-4 flex items-center text-[10px] text-primary font-black uppercase">
                        <span className="bg-primary/10 px-2 py-0.5 rounded">↑ Live Updates</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:shadow-premium transition-shadow">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Active Orders</span>
                    <p className="text-3xl font-black text-dark mt-2">{stats.totalCount}</p>
                    <div className="mt-4 flex items-center text-[10px] text-blue-500 font-black uppercase">
                        <span className="bg-blue-50 px-2 py-0.5 rounded">{stats.pendingCount} Action Required</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:shadow-premium transition-shadow">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Catalog Size</span>
                    <p className="text-3xl font-black text-dark mt-2">{products.length}</p>
                    <div className="mt-4 flex items-center text-[10px] text-gray-400 font-black uppercase">
                        <span className="bg-gray-50 px-2 py-0.5 rounded">Active Items</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:shadow-premium transition-shadow">
                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Best Seller</span>
                    <p className="text-lg font-black text-dark mt-2 leading-tight truncate">
                        {stats.topProduct ? stats.topProduct.name : 'N/A'}
                    </p>
                    <div className="mt-4 flex items-center text-[10px] text-secondary font-black uppercase">
                        <span className="bg-secondary/10 px-2 py-0.5 rounded">{stats.topProduct ? `${stats.topProduct.quantity} units sold` : 'No data'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-premium border border-gray-100">
                <h3 className="text-lg font-black text-dark mb-8 flex items-center">
                    <div className="w-2 h-6 bg-primary rounded-full mr-3"></div>
                    Inventory Breakdown
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

    const handleProductImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
        setSyncMessage('Updating Catalog...');
        
        const formattedImage = formatGDriveLink(newProduct.image || '');
        const productData = { 
            ...newProduct, 
            id: editingProduct ? editingProduct.id : Date.now().toString(),
            image: formattedImage 
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
        }, 2000);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setIsSyncing(true);
            setSyncMessage('Removing Item...');
            deleteProductExplicit(id);
            setTimeout(() => {
                setIsSyncing(false);
                setSyncMessage('');
            }, 2000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-dark tracking-tight">Admin Console</h2>
                        <p className="text-gray-400 text-sm mt-1 font-medium">TazaMart Management</p>
                    </div>
                    {isSyncing && (
                        <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full animate-pulse">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 animate-bounce"></div>
                            <span className="text-[8px] font-black uppercase tracking-widest">{syncMessage}</span>
                        </div>
                    )}
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl shadow-premium border border-gray-100">
                    <button onClick={() => setTab('dashboard')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'dashboard' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-gray-400 hover:text-dark'}`}>Dashboard</button>
                    <button onClick={() => setTab('orders')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'orders' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-gray-400 hover:text-dark'}`}>Orders</button>
                    <button onClick={() => setTab('products')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'products' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-gray-400 hover:text-dark'}`}>Products</button>
                </div>
            </div>

            {tab === 'dashboard' && <AdminDashboard orders={orders} products={products} />}

            {tab === 'orders' && (
                <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">ID</th>
                                    <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Customer</th>
                                    <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Amount</th>
                                    <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Status</th>
                                    <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.slice().reverse().map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-6 font-black text-xs text-gray-400 group-hover:text-dark">#{order.id.split('-').pop()}</td>
                                        <td className="p-6">
                                            <div className="text-sm font-black text-dark">{order.customer.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold flex items-center mt-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-1.5"></span>
                                                {order.customer.phone}
                                            </div>
                                        </td>
                                        <td className="p-6 font-black text-sm text-primary">Rs. {order.total.toLocaleString()}</td>
                                        <td className="p-6">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none transition-all shadow-sm cursor-pointer
                                                    ${order.status === OrderStatus.Pending ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 
                                                      order.status === OrderStatus.Packed ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                                                      'bg-green-50 text-green-600 border border-green-100'}`}
                                            >
                                                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => setSelectedOrder(order)} title="Print Invoice" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-dark hover:border-dark shadow-sm transition-all"><PrintIcon className="h-4 w-4"/></button>
                                                <button onClick={() => setProofToView(order.paymentProof)} title="View Proof" className="p-3 bg-primary/5 border border-primary/10 rounded-2xl text-primary hover:bg-primary hover:text-white shadow-sm transition-all"><ExternalLinkIcon className="h-4 w-4"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'products' && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => { setEditingProduct(null); setNewProduct({ name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: '' }); setIsProductModalOpen(true); }} 
                            className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all"
                        >
                            <PlusIcon className="h-5 w-5 mr-3" /> Add Product
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Image</th>
                                        <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Name</th>
                                        <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Category</th>
                                        <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Price</th>
                                        <th className="p-6 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="p-6">
                                                <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-soft border border-gray-100" alt={p.name} />
                                            </td>
                                            <td className="p-6 font-black text-dark text-sm">{p.name}</td>
                                            <td className="p-6">
                                                <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-lg text-gray-500">{p.category}</span>
                                            </td>
                                            <td className="p-6 font-black text-dark text-sm">Rs. {p.price} / {p.unit}</td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button onClick={() => { setEditingProduct(p); setNewProduct(p); setIsProductModalOpen(true); }} className="p-2 text-primary bg-primary/5 rounded-xl hover:bg-primary hover:text-white transition-all">
                                                        <span className="material-symbols-rounded text-lg">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-premium overflow-y-auto max-h-[90vh] no-scrollbar animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black text-dark">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-dark transition-colors">
                                <span className="material-symbols-rounded text-2xl">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Product Name</label>
                                <input required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Red Apples" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Price (Rs)</label>
                                    <input required type="number" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Pricing Unit</label>
                                    <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value as any})}>
                                        <option value="kg">Per kg</option>
                                        <option value="piece">Per piece</option>
                                        <option value="bundle">Per bundle</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Category</label>
                                <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                                    {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Product Image URL</label>
                                <input className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-xs font-medium" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="Paste Image Link" />
                                {newProduct.image && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                                        <img src={formatGDriveLink(newProduct.image)} className="h-24 w-auto rounded-xl shadow-lg" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Invalid+Link')} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Description</label>
                                <textarea className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-24 no-scrollbar" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Details..." />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase tracking-widest bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all">Discard</button>
                                <button type="submit" className="flex-1 px-8 py-5 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-primary to-primary-dark text-white shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedOrder && <Invoice order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            
            {/* Proof Viewer */}
            {proofToView && (
                <div className="fixed inset-0 bg-dark/80 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={() => setProofToView(null)}>
                    <div className="bg-white rounded-3xl p-4 shadow-premium max-w-2xl" onClick={e => e.stopPropagation()}>
                        <img src={proofToView} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" alt="Payment Proof" />
                    </div>
                </div>
            )}
        </div>
    );
};
