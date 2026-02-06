
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
                    Sales Performance
                </h3>
                <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
                    {[35, 65, 40, 95, 60, 80, 50, 75, 45, 90].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full">
                                <div 
                                    className="w-full bg-gradient-to-t from-primary-dark via-primary to-green-300 rounded-t-xl transition-all duration-700 group-hover:scale-x-110 group-hover:brightness-110 cursor-pointer" 
                                    style={{ height: `${height}%` }}
                                ></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {height}%
                                </div>
                            </div>
                            <span className="text-[9px] text-gray-400 mt-3 font-black uppercase">T-{10-i}</span>
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
    deleteProduct: (productId: number) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, products, updateOrderStatus, addProduct, updateProduct, deleteProduct }) => {
    const [tab, setTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [proofToView, setProofToView] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
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

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedImage = formatGDriveLink(newProduct.image || '');
        const productData = { ...newProduct, image: formattedImage } as Product;

        if (editingProduct) {
            updateProduct({ ...editingProduct, ...productData });
        } else {
            addProduct({ ...productData, id: Date.now() });
        }
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setNewProduct({ name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: '' });
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-dark tracking-tight">Admin Console</h2>
                    <p className="text-gray-400 text-sm mt-1 font-medium">Manage your farm-to-table business</p>
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
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <button 
                        onClick={() => { setEditingProduct(null); setNewProduct({ name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: '' }); setIsProductModalOpen(true); }} 
                        className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all"
                    >
                        <PlusIcon className="h-5 w-5 mr-3" /> New Item
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(p => (
                            <div key={p.id} className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 group hover:shadow-premium transition-all">
                                <div className="relative h-40 w-full mb-4 overflow-hidden rounded-2xl">
                                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 bg-dark/80 text-white text-[9px] font-black px-2 py-1 rounded-lg backdrop-blur-sm uppercase tracking-tighter">
                                        {p.category}
                                    </div>
                                </div>
                                <h4 className="font-black text-dark line-clamp-1">{p.name}</h4>
                                <p className="text-xs text-gray-400 font-bold mt-1">Rs. {p.price} / {p.unit}</p>
                                <div className="grid grid-cols-2 gap-2 mt-6">
                                    <button onClick={() => { setEditingProduct(p); setNewProduct(p); setIsProductModalOpen(true); }} className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/5 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all">Edit</button>
                                    <button onClick={() => deleteProduct(p.id)} className="text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-50 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Proof Viewer Modal */}
            {proofToView && (
                <div className="fixed inset-0 bg-dark/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300" onClick={() => setProofToView(null)}>
                    <div className="bg-white w-full max-w-2xl rounded-3xl p-4 shadow-premium relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setProofToView(null)} className="absolute -top-12 right-0 text-white font-black uppercase text-xs tracking-widest flex items-center">
                            Close [×]
                        </button>
                        <div className="overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                             <img src={proofToView} className="w-full h-auto max-h-[70vh] object-contain" alt="Payment Proof" />
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-black text-dark">Transaction Proof</h3>
                            <p className="text-gray-400 text-sm mt-1">Verify payment details carefully before packing.</p>
                            <a href={proofToView} download="payment-proof.png" className="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transform active:scale-95 transition-all">Download Full Image</a>
                        </div>
                    </div>
                </div>
            )}

            {isProductModalOpen && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-premium overflow-y-auto max-h-[90vh] no-scrollbar animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black text-dark">{editingProduct ? 'Edit Item' : 'New Item'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-dark transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Product Name</label>
                                <input required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Organic Tomatoes" />
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
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Visual Style (GDrive URL or Upload)</label>
                                <div className="space-y-4">
                                    <input className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-xs font-medium" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="Paste Image Link or GDrive Link" />
                                    <div className="flex items-center gap-4">
                                        <div className="flex-grow h-px bg-gray-100"></div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase">OR</span>
                                        <div className="flex-grow h-px bg-gray-100"></div>
                                    </div>
                                    <label className="flex items-center justify-center w-full px-6 py-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all group">
                                        {newProduct.image && newProduct.image.startsWith('data:') ? (
                                            <div className="text-center">
                                                <img src={newProduct.image} className="h-24 w-auto rounded-xl shadow-lg mb-2 mx-auto" />
                                                <p className="text-[10px] font-black text-primary uppercase">File Loaded!</p>
                                            </div>
                                        ) : (
                                            <div className="text-center group-hover:scale-105 transition-transform">
                                                <div className="text-2xl mb-2 text-gray-300">📂</div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Local File</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleProductImageUpload} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Description</label>
                                <textarea className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium h-32 no-scrollbar" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Describe the freshness..." />
                            </div>
                            <div className="flex space-x-4 pt-6">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase tracking-widest bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all">Discard</button>
                                <button type="submit" className="flex-1 px-8 py-5 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-primary to-primary-dark text-white shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedOrder && <Invoice order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </div>
    );
};
