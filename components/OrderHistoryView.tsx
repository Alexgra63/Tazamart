import React, { useEffect, useState } from 'react';
import { Order, OrderStatus, Language } from '../types';
import { Badge, Button, Card, EmptyState, Price, Sheet } from './ui';

interface OrderHistoryViewProps {
    orders: Order[];
    lang: Language;
    /** Secure backend: refresh statuses of local orders from the server. */
    onRefresh?: () => Promise<void>;
    /** Secure backend: look up any order by ID + phone. */
    lookupOrder?: (orderId: string, phone: string) => Promise<Order | null>;
}

const statusTone: Record<OrderStatus, 'amber' | 'blue' | 'green'> = {
    [OrderStatus.Pending]: 'amber',
    [OrderStatus.Packed]: 'blue',
    [OrderStatus.Delivered]: 'green',
};
const steps = [OrderStatus.Pending, OrderStatus.Packed, OrderStatus.Delivered];
const shortId = (id: string) => '#' + id.split('-').slice(1).join('-').slice(-10);

const StatusTimeline: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const idx = steps.indexOf(status);
    return (
        <ol className="flex items-center gap-1" aria-label={`Status: ${status}`}>
            {steps.map((s, i) => (
                <li key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i <= idx ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-700'}`} />
                    <p className={`mt-1 text-[11px] font-semibold ${i <= idx ? 'text-primary' : 'text-muted dark:text-stone-500'}`}>{s}</p>
                </li>
            ))}
        </ol>
    );
};

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, onRefresh, lookupOrder }) => {
    const [detail, setDetail] = useState<Order | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [trackOpen, setTrackOpen] = useState(false);
    const [trackId, setTrackId] = useState('');
    const [trackPhone, setTrackPhone] = useState('');
    const [trackError, setTrackError] = useState('');

    const refresh = async () => { if (!onRefresh) return; setRefreshing(true); try { await onRefresh(); } finally { setRefreshing(false); } };
    useEffect(() => { refresh(); /* once on open */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const track = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lookupOrder) return;
        setTrackError('');
        const o = await lookupOrder(trackId.trim(), trackPhone.trim());
        if (o) { setTrackOpen(false); setDetail(o); } else setTrackError('No order found with that ID and phone number.');
    };

    const sorted = orders.slice().sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    return (
        <div className="px-4 md:px-0 py-6 md:py-10 animate-in fade-in duration-300 text-left" dir="ltr">
            <div className="flex items-center justify-between gap-2 mb-4">
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink dark:text-white">My orders</h1>
                <div className="flex gap-1">
                    {lookupOrder && <Button variant="outline" size="sm" icon="search" onClick={() => setTrackOpen(true)}>Track</Button>}
                    {onRefresh && <Button variant="ghost" size="sm" icon="refresh" onClick={refresh} disabled={refreshing} aria-label="Refresh statuses">{refreshing ? '…' : ''}</Button>}
                </div>
            </div>

            {sorted.length === 0 ? (
                <EmptyState icon="receipt_long" title="No orders yet" description="Orders you place on this device appear here."
                    action={lookupOrder ? <Button variant="outline" icon="search" onClick={() => setTrackOpen(true)}>Track an order</Button> : undefined} />
            ) : (
                <ul className="space-y-3 max-w-2xl">
                    {sorted.map(order => (
                        <li key={order.id}>
                            <Card className="!p-0">
                                <button onClick={() => setDetail(order)} className="w-full text-left p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-ink dark:text-white tabular">{shortId(order.id)}</p>
                                            <p className="text-xs text-muted dark:text-stone-400">{new Date(order.orderDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <Price amount={order.total} className="text-base shrink-0" />
                                    </div>
                                    <StatusTimeline status={order.status} />
                                    <p className="text-sm text-muted dark:text-stone-400 truncate">{order.items.map(i => i.name).join(', ')}</p>
                                </button>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}

            {detail && (
                <Sheet title={`Order ${shortId(detail.id)}`} onClose={() => setDetail(null)}
                    footer={<Button fullWidth size="lg" variant="outline" icon="content_copy" onClick={() => navigator.clipboard?.writeText(detail.id)}>Copy order ID</Button>}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge tone={statusTone[detail.status]}>{detail.status}</Badge>
                            <span className="text-sm text-muted dark:text-stone-400">{new Date(detail.orderDate).toLocaleString()}</span>
                        </div>
                        <StatusTimeline status={detail.status} />
                        <ul className="divide-y divide-line">
                            {detail.items.map((it, i) => (
                                <li key={i} className="flex justify-between gap-3 py-2.5 text-sm">
                                    <span className="text-ink dark:text-stone-100 min-w-0">{it.name} <span className="text-muted">× {it.quantity} {it.unit}</span></span>
                                    <span className="tabular font-semibold shrink-0">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between items-baseline border-t border-line pt-3">
                            <span className="font-semibold">Total</span><Price amount={detail.total} className="text-xl" />
                        </div>
                        <p className="text-sm text-muted dark:text-stone-400">Paid via {detail.paymentMethod}</p>
                        <p className="text-xs text-muted dark:text-stone-500 break-all">Order ID: {detail.id}</p>
                    </div>
                </Sheet>
            )}

            {trackOpen && (
                <Sheet title="Track an order" onClose={() => setTrackOpen(false)}
                    footer={<Button fullWidth size="lg" type="submit" form="track-form" icon="search">Find order</Button>}>
                    <form id="track-form" onSubmit={track} className="space-y-4">
                        <p className="text-sm text-muted dark:text-stone-400">Enter the full order ID and the phone number used at checkout.</p>
                        <input required value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="ORD-…" className="w-full h-12 px-4 rounded-[10px] bg-white dark:bg-slate-800 border border-line outline-none focus:border-primary text-base" />
                        <input required type="tel" inputMode="tel" value={trackPhone} onChange={e => setTrackPhone(e.target.value)} placeholder="03xx-xxxxxxx" className="w-full h-12 px-4 rounded-[10px] bg-white dark:bg-slate-800 border border-line outline-none focus:border-primary text-base" />
                        {trackError && <p role="alert" className="text-sm text-red-600">{trackError}</p>}
                    </form>
                </Sheet>
            )}
        </div>
    );
};
