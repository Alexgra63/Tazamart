import React, { useState, ChangeEvent, useMemo, useRef } from 'react';
import { Order, OrderStatus, Product, ProductCategory, AppPage } from '../types';
import { Invoice } from './Invoice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge, Button, Card, EmptyState, IconButton, Price, Sheet, cn } from './ui';

type Tab = 'dashboard' | 'orders' | 'products' | 'pages';

const statusTone: Record<OrderStatus, 'amber' | 'blue' | 'green'> = {
    [OrderStatus.Pending]: 'amber',
    [OrderStatus.Packed]: 'blue',
    [OrderStatus.Delivered]: 'green',
};

const inputCls = 'w-full h-12 px-4 rounded-[10px] bg-white dark:bg-slate-800 border border-line outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 text-base text-ink dark:text-white';
const labelCls = 'block text-sm font-semibold text-ink dark:text-stone-200 mb-1.5';
const emptyProduct: Partial<Product> = { name: '', price: 0, image: '', category: ProductCategory.Vegetables, unit: 'kg', description: '' };

/* ------------------------------------------------------------ Dashboard */
const AdminDashboard: React.FC<{ orders: Order[]; products: Product[]; onGoOrders: () => void }> = ({ orders, products, onGoOrders }) => {
    const stats = useMemo(() => {
        const productSales: Record<string, number> = {};
        orders.forEach(o => (o.items || []).forEach(i => { productSales[i.name] = (productSales[i.name] || 0) + i.quantity; }));
        const top = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
        return {
            revenue: orders.reduce((s, o) => s + (Number(o.total) || 0), 0),
            pending: orders.filter(o => o.status === OrderStatus.Pending).length,
            total: orders.length,
            top: top ? top[0] : '—',
        };
    }, [orders]);
    const tiles = [
        { label: 'Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, icon: 'payments' },
        { label: 'Orders', value: String(stats.total), icon: 'receipt_long', sub: `${stats.pending} pending` },
        { label: 'Products', value: String(products.length), icon: 'inventory_2' },
        { label: 'Best seller', value: stats.top, icon: 'star' },
    ];
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {tiles.map(t => (
                    <Card key={t.label} className="!p-4">
                        <div className="flex items-center gap-2 text-muted dark:text-stone-400 text-sm"><span className="material-symbols-rounded text-[18px] text-primary">{t.icon}</span>{t.label}</div>
                        <p className="mt-1 text-xl md:text-2xl font-bold text-ink dark:text-white truncate tabular">{t.value}</p>
                        {t.sub && <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">{t.sub}</p>}
                    </Card>
                ))}
            </div>
            {stats.pending > 0 && (
                <Button variant="outline" fullWidth icon="pending_actions" onClick={onGoOrders}>Review {stats.pending} pending order{stats.pending > 1 ? 's' : ''}</Button>
            )}
            <Card className="!p-4">
                <h3 className="text-base font-semibold text-ink dark:text-white mb-3">Catalogue</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.values(ProductCategory).map(cat => (
                        <div key={cat} className="p-3 rounded-[10px] bg-gray-50 dark:bg-slate-800">
                            <p className="text-xs text-muted dark:text-stone-400">{cat}</p>
                            <p className="text-lg font-bold text-ink dark:text-white">{products.filter(p => p.category === cat).length}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

/* ------------------------------------------------------------ Main view */
interface AdminViewProps {
    orders: Order[];
    products: Product[];
    pages: AppPage[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProductExplicit: (productId: number) => void;
    updatePage: (page: AppPage) => void;
    onLogout?: () => void;
    onRefresh?: () => void;
    /** Secure backend: fetch a payment proof on demand (admin token required). */
    loadProof?: (orderId: string) => Promise<string>;
}

export const AdminView: React.FC<AdminViewProps> = ({
    orders, products, pages, updateOrderStatus, addProduct, updateProduct, deleteProductExplicit, updatePage, onLogout, onRefresh, loadProof,
}) => {
    const [tab, setTab] = useState<Tab>('dashboard');
    const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
    const [detailOrder, setDetailOrder] = useState<Order | null>(null);
    const [proofToView, setProofToView] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [toast, setToast] = useState('');
    const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');
    const [orderQuery, setOrderQuery] = useState('');
    const [productQuery, setProductQuery] = useState('');

    const [selectedPage, setSelectedPage] = useState<AppPage | null>(null);
    const [localPageContent, setLocalPageContent] = useState('');
    const [pagePreview, setPagePreview] = useState(false);
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [newPageSlug, setNewPageSlug] = useState('');
    const [newProduct, setNewProduct] = useState<Partial<Product>>(emptyProduct);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 1500); };

    const handleAddPage = () => {
        if (!newPageTitle || !newPageSlug) return;
        updatePage({ id: `page-${Date.now()}`, title: newPageTitle, slug: newPageSlug.toLowerCase().replace(/\s+/g, '-'), content: '# New Page\n\nEdit this content...', lastUpdated: new Date() });
        setIsAddingPage(false); setNewPageTitle(''); setNewPageSlug('');
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setNewProduct(p => ({ ...p, image: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const openProduct = (p: Product | null) => { setEditingProduct(p); setNewProduct(p || emptyProduct); setIsProductModalOpen(true); };

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = { ...newProduct, id: editingProduct ? editingProduct.id : Date.now() } as Product;
        if (editingProduct) updateProduct(productData); else addProduct(productData);
        setIsProductModalOpen(false); setEditingProduct(null); setNewProduct(emptyProduct);
        flash('Saving to server…');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this product?')) { deleteProductExplicit(id); flash('Removing item…'); }
    };

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        updateOrderStatus(orderId, status);
        setDetailOrder(o => (o && o.id === orderId ? { ...o, status } : o));
        flash(`Marked ${status}`);
    };

    const viewProof = async (order: Order) => {
        if (loadProof) {
            flash('Loading proof…');
            try { setProofToView(await loadProof(order.id)); } catch { alert('Could not load payment proof.'); }
        } else if (order.paymentProof) setProofToView(order.paymentProof);
    };

    const filteredOrders = useMemo(() => {
        const q = orderQuery.trim().toLowerCase();
        return orders.slice().reverse().filter(o =>
            (orderFilter === 'All' || o.status === orderFilter) &&
            (!q || o.id.toLowerCase().includes(q) || o.customer?.name?.toLowerCase().includes(q) || String(o.customer?.phone || '').includes(q)));
    }, [orders, orderFilter, orderQuery]);

    const filteredProducts = useMemo(() => {
        const q = productQuery.trim().toLowerCase();
        return q ? products.filter(p => p.name.toLowerCase().includes(q)) : products;
    }, [products, productQuery]);

    const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
        { id: 'dashboard', label: 'Overview', icon: 'space_dashboard' },
        { id: 'orders', label: 'Orders', icon: 'receipt_long', count: orders.filter(o => o.status === OrderStatus.Pending).length },
        { id: 'products', label: 'Products', icon: 'inventory_2' },
        { id: 'pages', label: 'Pages', icon: 'article' },
    ];

    const shortId = (id: string) => '#' + id.split('-').slice(1).join('-').slice(-10);

    return (
        <div className="pb-28 md:pb-10" dir="ltr">
            {/* Sticky admin header + tabs */}
            <div className="sticky top-16 z-40 bg-light/95 dark:bg-dark/95 backdrop-blur border-b border-line -mx-0 md:mx-0">
                <div className="flex items-center justify-between gap-2 px-4 md:px-0 pt-3">
                    <div className="min-w-0">
                        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink dark:text-white">Admin</h1>
                        <p className="text-xs text-muted dark:text-stone-400">Tazamart portal</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {onRefresh && <IconButton icon="refresh" label="Refresh" onClick={() => { onRefresh(); flash('Refreshing…'); }} />}
                        {onLogout && <IconButton icon="logout" label="Sign out" onClick={onLogout} />}
                    </div>
                </div>
                <nav className="flex gap-1 overflow-x-auto no-scrollbar px-4 md:px-0 mt-2" role="tablist">
                    {tabs.map(t => (
                        <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                            className={cn('shrink-0 h-11 px-3 flex items-center gap-1.5 text-sm font-semibold border-b-2 transition-colors',
                                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted dark:text-stone-400')}>
                            <span className="material-symbols-rounded text-[20px]">{t.icon}</span>{t.label}
                            {!!t.count && <span className="min-w-5 h-5 px-1 rounded-full bg-secondary text-stone-950 text-[11px] font-bold flex items-center justify-center">{t.count}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {toast && (
                <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] rounded-full bg-ink dark:bg-white text-white dark:text-stone-950 px-4 py-2 text-sm font-semibold shadow-premium">{toast}</div>
            )}

            <div className="px-4 md:px-0 pt-4">
                {tab === 'dashboard' && <AdminDashboard orders={orders} products={products} onGoOrders={() => { setTab('orders'); setOrderFilter(OrderStatus.Pending); }} />}

                {/* ---------------- Orders: card list */}
                {tab === 'orders' && (
                    <div className="space-y-3">
                        <input type="search" value={orderQuery} onChange={e => setOrderQuery(e.target.value)} placeholder="Search name, phone or order ID" className={inputCls} />
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {(['All', ...Object.values(OrderStatus)] as const).map(s => (
                                <button key={s} onClick={() => setOrderFilter(s)} aria-pressed={orderFilter === s}
                                    className={cn('shrink-0 h-9 px-3 rounded-full text-sm font-semibold border', orderFilter === s ? 'bg-ink text-white border-ink dark:bg-white dark:text-stone-950' : 'border-line text-muted dark:text-stone-300')}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        {filteredOrders.length === 0 ? <EmptyState icon="inbox" title="No orders" description="Orders matching this filter will show here." /> : (
                            <ul className="space-y-3">
                                {filteredOrders.map(order => (
                                    <li key={order.id}>
                                        <Card className="!p-4">
                                            <button className="w-full text-left" onClick={() => setDetailOrder(order)}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-ink dark:text-white truncate">{order.customer?.name || '—'}</p>
                                                        <p className="text-sm text-muted dark:text-stone-400 tabular">{order.customer?.phone}</p>
                                                    </div>
                                                    <Badge tone={statusTone[order.status] || 'neutral'}>{order.status}</Badge>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-sm">
                                                    <span className="text-muted dark:text-stone-400 tabular">{shortId(order.id)} · {new Date(order.orderDate).toLocaleDateString()}</span>
                                                    <Price amount={order.total} />
                                                </div>
                                            </button>
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {Object.values(OrderStatus).map(s => (
                                                    <button key={s} onClick={() => handleStatusChange(order.id, s)} disabled={order.status === s}
                                                        className={cn('h-11 rounded-[10px] text-sm font-semibold border transition-colors',
                                                            order.status === s ? 'bg-primary-soft border-primary text-primary-dark dark:text-primary' : 'border-line text-ink dark:text-stone-200 active:bg-gray-100 dark:active:bg-slate-800')}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </Card>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* ---------------- Products: card list */}
                {tab === 'products' && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input type="search" value={productQuery} onChange={e => setProductQuery(e.target.value)} placeholder="Search products" className={inputCls} />
                            <Button className="hidden md:inline-flex shrink-0 !h-12" icon="add" onClick={() => openProduct(null)}>Add product</Button>
                        </div>
                        <ul className="grid md:grid-cols-2 gap-3">
                            {filteredProducts.map(p => (
                                <li key={p.id}>
                                    <Card className="!p-3 flex items-center gap-3">
                                        <img src={p.image} alt="" className="w-16 h-16 rounded-[10px] object-cover bg-gray-50 dark:bg-slate-800 shrink-0" referrerPolicy="no-referrer"
                                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Img'; }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-ink dark:text-white truncate">{p.name}</p>
                                            <p className="text-xs text-muted dark:text-stone-400 truncate">{p.category}</p>
                                            <Price amount={p.price} unit={p.unit} className="text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <IconButton icon="edit" label={`Edit ${p.name}`} onClick={() => openProduct(p)} className="!h-11 !w-11 text-primary" />
                                            <IconButton icon="delete" label={`Delete ${p.name}`} onClick={() => handleDelete(p.id)} className="!h-11 !w-11 text-red-600" />
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                        {/* sticky mobile action */}
                        <div className="md:hidden fixed bottom-16 inset-x-0 z-40 px-4 pb-3 pointer-events-none">
                            <Button size="lg" fullWidth icon="add" className="pointer-events-auto shadow-premium" onClick={() => openProduct(null)}>Add product</Button>
                        </div>
                    </div>
                )}

                {/* ---------------- Pages */}
                {tab === 'pages' && (
                    selectedPage ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <IconButton icon="arrow_back" label="Back to pages" onClick={() => setSelectedPage(null)} />
                                <h2 className="text-lg font-semibold text-ink dark:text-white truncate flex-1">{selectedPage.title}</h2>
                            </div>
                            <div className="inline-flex rounded-[10px] border border-line p-1 md:hidden">
                                {['Edit', 'Preview'].map((l, i) => (
                                    <button key={l} onClick={() => setPagePreview(i === 1)} className={cn('h-9 px-4 rounded-md text-sm font-semibold', pagePreview === (i === 1) ? 'bg-primary-soft text-primary-dark dark:text-primary' : 'text-muted')}>{l}</button>
                                ))}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <textarea value={localPageContent} onChange={e => setLocalPageContent(e.target.value)}
                                    className={cn('w-full min-h-[55vh] p-4 rounded-[10px] bg-white dark:bg-slate-800 border border-line outline-none focus:border-primary font-mono text-sm leading-relaxed text-ink dark:text-white', pagePreview && 'hidden md:block')} />
                                <div className={cn('min-h-[55vh] p-4 rounded-[10px] border border-line bg-white dark:bg-slate-900 overflow-y-auto prose prose-stone dark:prose-invert prose-sm max-w-none', !pagePreview && 'hidden md:block')}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{localPageContent || '_No content yet._'}</ReactMarkdown>
                                </div>
                            </div>
                            <div className="sticky bottom-16 md:bottom-0 z-30 bg-light/95 dark:bg-dark/95 py-3">
                                <Button size="lg" fullWidth icon="save" onClick={() => { updatePage({ ...selectedPage, content: localPageContent, lastUpdated: new Date() }); flash('Page saved'); }}>Save changes</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Button variant="outline" fullWidth icon="add_circle" onClick={() => setIsAddingPage(true)}>Add custom page</Button>
                            {pages.map(page => (
                                <Card key={page.id} className="!p-0">
                                    <button onClick={() => { setSelectedPage(page); setLocalPageContent(page.content); setPagePreview(false); }} className="w-full flex items-center justify-between gap-3 p-4 min-h-14 text-left">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-ink dark:text-white truncate">{page.title}</p>
                                            <p className="text-xs text-muted dark:text-stone-400">/{page.slug}</p>
                                        </div>
                                        <span className="material-symbols-rounded text-muted">chevron_right</span>
                                    </button>
                                </Card>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* ---------------- Order detail sheet */}
            {detailOrder && (
                <Sheet title={`Order ${shortId(detailOrder.id)}`} onClose={() => setDetailOrder(null)}
                    footer={<>
                        <Button variant="outline" icon="receipt" className="flex-1" onClick={() => setInvoiceOrder(detailOrder)}>Invoice</Button>
                        <Button variant="outline" icon="image" className="flex-1" onClick={() => viewProof(detailOrder)} disabled={!loadProof && !detailOrder.paymentProof}>Payment proof</Button>
                    </>}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between"><Badge tone={statusTone[detailOrder.status]}>{detailOrder.status}</Badge><span className="text-sm text-muted">{new Date(detailOrder.orderDate).toLocaleString()}</span></div>
                        <div className="rounded-[10px] bg-gray-50 dark:bg-slate-800 p-3 text-sm space-y-1">
                            <p className="font-semibold text-ink dark:text-white">{detailOrder.customer?.name}</p>
                            {detailOrder.customer?.phone && <a href={`tel:${detailOrder.customer.phone}`} className="flex items-center gap-1 text-primary font-semibold min-h-11"><span className="material-symbols-rounded text-[18px]">call</span>{detailOrder.customer.phone}</a>}
                            <p className="text-muted dark:text-stone-300">{detailOrder.customer?.address}</p>
                            <p className="text-muted dark:text-stone-400">Paid via {detailOrder.paymentMethod}</p>
                        </div>
                        <ul className="divide-y divide-line">
                            {(detailOrder.items || []).map((it, i) => (
                                <li key={i} className="flex justify-between gap-3 py-2 text-sm">
                                    <span className="text-ink dark:text-stone-100">{it.name} <span className="text-muted">× {it.quantity} {it.unit}</span></span>
                                    <span className="tabular font-semibold">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold"><span>Total</span><Price amount={detailOrder.total} className="text-lg" /></div>
                        <div>
                            <p className={labelCls}>Update status</p>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.values(OrderStatus).map(s => (
                                    <Button key={s} variant={detailOrder.status === s ? 'primary' : 'outline'} onClick={() => handleStatusChange(detailOrder.id, s)}>{s}</Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Sheet>
            )}

            {/* ---------------- Product add/edit sheet */}
            {isProductModalOpen && (
                <Sheet title={editingProduct ? 'Edit product' : 'Add product'} onClose={() => setIsProductModalOpen(false)}
                    footer={<>
                        <Button variant="outline" className="flex-1" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                        <Button type="submit" form="product-form" className="flex-1" icon="save">Save</Button>
                    </>}>
                    <form id="product-form" onSubmit={handleProductSubmit} className="space-y-4">
                        <div><label className={labelCls}>Name</label><input required className={inputCls} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Red apples" /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={labelCls}>Price (Rs)</label><input required type="number" inputMode="decimal" className={inputCls} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} /></div>
                            <div><label className={labelCls}>Unit</label>
                                <select className={inputCls} value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value as Product['unit'] })}>
                                    <option value="kg">Per kg</option><option value="piece">Per piece</option><option value="bundle">Per bundle</option>
                                </select></div>
                        </div>
                        <div><label className={labelCls}>Category</label>
                            <select className={inputCls} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}>
                                {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                            </select></div>
                        <div>
                            <label className={labelCls}>Image</label>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-3 rounded-[10px] border-2 border-dashed border-line hover:border-primary text-left">
                                {newProduct.image ? <img src={newProduct.image} alt="" className="h-16 w-16 rounded-md object-cover" referrerPolicy="no-referrer" />
                                    : <span className="material-symbols-rounded text-4xl text-muted">add_photo_alternate</span>}
                                <span className="text-sm font-semibold text-primary">{newProduct.image ? 'Change image' : 'Upload image (JPG/PNG)'}</span>
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div><label className={labelCls}>Description</label><textarea className={cn(inputCls, '!h-24 py-3')} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                    </form>
                </Sheet>
            )}

            {isAddingPage && (
                <Sheet title="Add custom page" onClose={() => setIsAddingPage(false)} footer={<Button fullWidth size="lg" onClick={handleAddPage}>Create page</Button>}>
                    <div className="space-y-4">
                        <div><label className={labelCls}>Title</label><input value={newPageTitle} onChange={e => setNewPageTitle(e.target.value)} className={inputCls} placeholder="e.g. FAQ" /></div>
                        <div><label className={labelCls}>URL slug</label><input value={newPageSlug} onChange={e => setNewPageSlug(e.target.value)} className={inputCls} placeholder="e.g. faq" /></div>
                    </div>
                </Sheet>
            )}

            {invoiceOrder && <Invoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}

            {proofToView && (
                <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4" onClick={() => setProofToView(null)}>
                    <img src={proofToView} className="max-w-full max-h-[85vh] object-contain rounded-xl" alt="Payment proof" />
                    <IconButton icon="close" label="Close" className="absolute top-4 right-4 !text-white" onClick={() => setProofToView(null)} />
                </div>
            )}
        </div>
    );
};
