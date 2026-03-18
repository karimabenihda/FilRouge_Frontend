"use client"
import { Button } from '@/components/ui/button'
import { Search, Package, ShoppingCart, LayoutDashboard } from 'lucide-react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

function ClientNav() {
    const [open, setOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)
    const [role, setRole] = useState(null)

    const getHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ── Decode JWT and get role ───────────────────────────────────────────────
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const payload = JSON.parse(atob(token.split(".")[1]));
            setRole(payload.role ?? null);
        } catch {
            setRole(null);
        }
    }, []);

    const fetchCounts = async () => {
        const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;
        if (!userId) return;

        const headers = getHeaders();

        try {
            try {
                const cartRes = await axios.get(`http://127.0.0.1:8000/api/sales/${userId}`, { headers })
                setCartCount(cartRes.data.length || 0)
            } catch (err) {
                if (err.response?.status === 404) setCartCount(0)
                else console.error("Error fetching cart count:", err)
            }

            try {
                const orderRes = await axios.get(`http://127.0.0.1:8000/api/sales/get_orders/${userId}`, { headers })
                setOrderCount(orderRes.data.orders?.length || 0)
            } catch (err) {
                if (err.response?.status === 404) setOrderCount(0)
                else console.error("Error fetching order count:", err)
            }
        } catch (err) {
            console.error("Error in fetchCounts:", err)
        }
    };

    useEffect(() => {
        fetchCounts();
        const handleUpdate = () => fetchCounts();
        window.addEventListener("cartUpdated", handleUpdate);
        return () => window.removeEventListener("cartUpdated", handleUpdate);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/auth/logout", {}, { headers: getHeaders() });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.clear();
            window.location.href = "/auth/login";
        }
    };

    const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem("token");

    const AuthButton = ({ className = "" }) => (
        isAuthenticated ? (
            <Button onClick={handleLogout} className={className}>Logout</Button>
        ) : (
            <Button className={className}>
                <a href="/auth/login">Login</a>
            </Button>
        )
    );

    // ── Dashboard icon for admin ──────────────────────────────────────────────
    const DashboardIcon = () => (
        <a href="/dashboard" className="relative cursor-pointer text-gray-700 hover:text-[#091422] transition-colors" title="Dashboard">
            <LayoutDashboard size={20} />
        </a>
    )

    const TrackingIcon = () => (
        <a href="/landing/orderTracking" className="relative cursor-pointer text-gray-700 hover:text-[#091422] transition-colors">
            <Package size={20} />
            {orderCount > 0 && (
                <span className="absolute -top-2 -right-3 text-[10px] text-white bg-[#091422] w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold">
                    {orderCount}
                </span>
            )}
        </a>
    )

    const CartIcon = () => (
        <a href="/landing/cart" className="relative cursor-pointer text-gray-700 hover:text-[#091422] transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 text-[10px] text-white bg-[#c8ad93] w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </a>
    )

    // ── Render cart/tracking OR dashboard based on role ───────────────────────
    const NavIcons = () => (
        role === "admin"
            ? <DashboardIcon />
            : <>
                <CartIcon />
                <TrackingIcon />
              </>
    )

    return (
        <nav className="flex justify-between items-center max-w-6xl mx-auto py-3.5 border-b border-slate-200/20 w-full">
            <img src="/images/logo/elan.png" className='h-10 -mt-3' />

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <a href="/">Home</a>
                <a href="/landing/collection">Collections</a>
                <a href="/landing/Contact">Contact</a>

                <NavIcons />
                <AuthButton />
            </div>

            <button onClick={() => setOpen(!open)} aria-label="Menu" className="px-4 md:px-1 sm:hidden hover:cursor-pointer">
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} space-y-2 text-[#1e3753] absolute top-[60px] left-0 w-full bg-white z-14 shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <div className="relative w-full md:w-50 text-gray-600">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <a href="/" className="block">Home</a>
                <a href="/landing/collection" className="block">Collections</a>
                <a href="/landing/Contact" className="block">Contact</a>

                <NavIcons />
                <AuthButton className="-ml-1" />
            </div>
        </nav>
    )
}

export default ClientNav