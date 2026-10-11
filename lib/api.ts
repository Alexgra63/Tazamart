/**
 * Backend client for the Google Apps Script API.
 *
 * Two modes:
 *  - legacy (default): the original unauthenticated script. GET returns products and orders, and
 *    POST writes are fire-and-forget (no-cors). Admin login is unavailable in this mode.
 *  - secure (VITE_BACKEND_AUTH=true): the hardened script in backend/Code.gs. Admin logs in on the
 *    server, gets a short-lived signed session token, and every admin call sends it.
 */
import { Order, Product } from '../types';

export const GAS_API_URL = (import.meta.env.VITE_GAS_API_URL as string | undefined) ||
    'https://script.google.com/macros/s/AKfycbzvvBAQPgKeaGB3WnZXxzvIGtxVu4nz9-wHIVCpMqQdzFDN2ISH-FVKUYaSb5oAYC0lFg/exec';

export const SECURE_BACKEND = import.meta.env.VITE_BACKEND_AUTH === 'true';

const TOKEN_KEY = 'tazamart_admin_session';

type Session = { token: string; expiresAt: number };

export const session = {
    get(): Session | null {
        try {
            const s = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || 'null') as Session | null;
            if (s && s.expiresAt > Date.now()) return s;
            sessionStorage.removeItem(TOKEN_KEY);
        } catch { /* ignore */ }
        return null;
    },
    set(s: Session) { sessionStorage.setItem(TOKEN_KEY, JSON.stringify(s)); },
    clear() { sessionStorage.removeItem(TOKEN_KEY); },
};

export class AuthError extends Error {}

/** CORS POST with JSON as text/plain (a "simple request", so no preflight; Apps Script allows it). */
async function call<T = any>(action: string, data: Record<string, unknown> = {}, admin = false): Promise<T> {
    const body: Record<string, unknown> = { action, ...data };
    if (admin) {
        const s = session.get();
        if (!s) throw new AuthError('Not signed in');
        body.token = s.token;
    }
    const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json && json.ok === false) {
        if (json.error === 'unauthorized') { session.clear(); throw new AuthError('Session expired'); }
        const e = new Error(json.error || 'request_failed') as Error & { info?: unknown };
        e.info = json;
        throw e;
    }
    return json as T;
}

/** Legacy fire-and-forget write (opaque response). */
async function legacyPost(action: string, data: Record<string, unknown>) {
    await fetch(GAS_API_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action, ...data }),
    });
}

const parseOrders = (orders: any[]): Order[] =>
    (orders || []).map((o: any) => ({ ...o, orderDate: new Date(o.orderDate) }));

const parseProducts = (products: any[]): Product[] =>
    (products || []).map((p: any) => ({ ...p, price: parseFloat(p.price), id: isNaN(Number(p.id)) ? p.id : Number(p.id) }));

export const api = {
    async fetchCatalogue(): Promise<{ products: Product[] | null; orders: Order[] }> {
        const res = await fetch(GAS_API_URL, { method: 'GET', cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return {
            products: data.products ? parseProducts(data.products) : null,
            // Secure backend never returns orders publicly; legacy backend does.
            orders: SECURE_BACKEND ? [] : parseOrders(data.orders),
        };
    },

    async login(password: string): Promise<{ ok: boolean; error?: string; retryAfterSeconds?: number }> {
        try {
            const r = await call<{ token: string; expiresAt: number }>('login', { password });
            session.set({ token: r.token, expiresAt: r.expiresAt });
            return { ok: true };
        } catch (e: any) {
            return { ok: false, error: e?.info?.error || e.message, retryAfterSeconds: e?.info?.retryAfterSeconds };
        }
    },
    logout() { session.clear(); },

    async listOrders(): Promise<Order[]> {
        const r = await call<{ orders: any[] }>('listOrders', {}, true);
        return parseOrders(r.orders);
    },
    async getPaymentProof(orderId: string): Promise<string> {
        const r = await call<{ dataUrl: string }>('getPaymentProof', { orderId }, true);
        return r.dataUrl;
    },

    /** Returns the server-assigned order id in secure mode. */
    async addOrder(order: Record<string, unknown>): Promise<string | null> {
        if (!SECURE_BACKEND) { await legacyPost('addOrder', { order }); return null; }
        const r = await call<{ orderId: string }>('addOrder', { order });
        return r.orderId;
    },
    async lookupOrder(orderId: string, phone: string): Promise<Order | null> {
        try {
            const r = await call<{ order: any }>('lookupOrder', { orderId, phone });
            return parseOrders([r.order])[0];
        } catch { return null; }
    },

    async adminWrite(action: 'add' | 'edit' | 'delete' | 'updateOrderStatus', data: Record<string, unknown>) {
        if (!SECURE_BACKEND) return legacyPost(action, data);
        return call(action, data, true);
    },
};
