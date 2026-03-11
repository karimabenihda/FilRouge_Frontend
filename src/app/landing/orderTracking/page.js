"use client"
import ClientNav from "@/app/navigation/ClientNav";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PackageCheck, Loader2, AlertCircle, CreditCard, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "shipped", "delivering", "delivered"];

const STATUS_META = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700 border-blue-200" },
  preparing:  { label: "Preparing",  color: "bg-purple-100 text-purple-700 border-purple-200" },
  shipped:    { label: "Shipped",    color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  delivering: { label: "Delivering", color: "bg-orange-100 text-orange-700 border-orange-200" },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200" },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700 border-red-200" },
};

const CANCELLABLE = ["pending", "confirmed", "preparing"];

// ── Timeline component ──
function Timeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-500 font-medium text-sm py-3 px-4 bg-red-50 rounded-xl border border-red-100">
        <AlertCircle size={16} /> This order has been cancelled
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <div className="w-full py-2">
      {/* Desktop */}
      <div className="hidden md:flex items-center w-full">
        {STATUS_FLOW.map((s, i) => {
          const isDone   = i < currentIndex;
          const isActive = i === currentIndex;
          const isLast   = i === STATUS_FLOW.length - 1;
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${isDone   ? "bg-[#091422] border-[#091422] text-white shadow-md" : ""}
                  ${isActive ? "bg-[#c8ad93] border-[#c8ad93] text-white shadow-lg scale-110" : ""}
                  ${!isDone && !isActive ? "bg-white border-gray-200 text-gray-300" : ""}
                `}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap
                  ${isActive ? "text-[#c8ad93] font-bold" : isDone ? "text-[#091422]" : "text-gray-300"}
                `}>
                  {STATUS_META[s].label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-500
                  ${isDone ? "bg-[#091422]" : "bg-gray-100"}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-2">
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FLOW.map((s, i) => {
            const isDone   = i < currentIndex;
            const isActive = i === currentIndex;
            return (
              <span key={s} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                ${isDone   ? "bg-[#091422]/10 border-[#091422]/30 text-[#091422]" : ""}
                ${isActive ? "bg-[#c8ad93] border-[#c8ad93] text-white" : ""}
                ${!isDone && !isActive ? "bg-gray-50 border-gray-100 text-gray-300" : ""}
              `}>
                {isDone ? "✓ " : ""}{STATUS_META[s].label}
              </span>
            );
          })}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-[#091422] to-[#c8ad93] h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${((currentIndex + 1) / STATUS_FLOW.length) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-400 text-right">
          Step {currentIndex + 1}/{STATUS_FLOW.length} — <span className="font-semibold text-[#091422]">{STATUS_META[status]?.label}</span>
        </p>
      </div>
    </div>
  );
}

// ── Single order card ──
function OrderCard({ order, onCancel, cancelling }) {
  const [expanded, setExpanded] = useState(true);
  const meta = STATUS_META[order.status] || STATUS_META.pending;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
      {/* Card header — always visible */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#091422]/5 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingBag size={18} className="text-[#091422]" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">
              Order <span className="text-[#091422]">#{order.id}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${meta.color}`}>
            {meta.label}
          </span>
          <p className="font-bold text-[#091422] text-base">${order.totalprice.toFixed(2)}</p>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-50">

          {/* Timeline */}
          <div className="pt-4">
            <Timeline status={order.status} />
          </div>

          {/* Product row */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
              <img
                src={order.product?.image || "/placeholder.png"}
                alt={order.product?.ProductName || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate text-sm">
                {order.product?.ProductName || `Product #${order.product_id}`}
              </p>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-xs text-gray-400">
                  Qty: <span className="font-semibold text-gray-600">{order.product_qte}</span>
                </span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">
                  Unit: <span className="font-semibold text-gray-600">${order.product?.price?.toFixed(2) ?? "—"}</span>
                </span>
              </div>
            </div>
            <p className="font-bold text-[#091422] text-lg shrink-0">${order.totalprice.toFixed(2)}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/landing/Contact"}
              className="text-xs border-gray-200 text-gray-500 hover:text-[#091422] hover:border-[#091422]">
              Contact Support
            </Button>
            {CANCELLABLE.includes(order.status) && (
              <Button size="sm" disabled={cancelling === order.id} onClick={() => onCancel(order.id)}
                className="text-xs bg-red-500 hover:bg-red-600 text-white">
                {cancelling === order.id
                  ? <><Loader2 size={12} className="animate-spin mr-1" /> Cancelling...</>
                  : "Cancel Order"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ──
export default function OrderTracking() {
  const router = useRouter();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError]       = useState("");

  useEffect(() => {
    const customer_id = localStorage.getItem("user_id");
    if (!customer_id) { router.push("/auth/login"); return; }
    axios.get(`http://127.0.0.1:8000/api/Sales/get_orders/${customer_id}`)
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 404) setData({ orders: [], total_price: 0, payment: null });
        else setError("Failed to load orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (orderId) => {
    setCancelling(orderId);
    try {
      await axios.put(`http://127.0.0.1:8000/api/Sales/${orderId}/cancel`);
      setData(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o),
      }));
    } catch (err) {
      alert(err.response?.data?.detail || "Cannot cancel this order.");
    } finally {
      setCancelling(null);
    }
  };

  // Stats derived from data
  const activeOrders    = data?.orders?.filter(o => o.status !== "cancelled" && o.status !== "delivered").length ?? 0;
  const deliveredOrders = data?.orders?.filter(o => o.status === "delivered").length ?? 0;
  const totalOrders     = data?.orders?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <ClientNav />

      {/* Hero header */}
      <div className="bg-[#091422] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/landing/cart" className="hover:text-white transition-colors">Cart</a>
            <span>/</span>
            <a href="/landing/checkout" className="hover:text-white transition-colors">Checkout</a>
            <span>/</span>
            <span className="text-[#c8ad93]">Order Tracking</span>
          </nav>
          <h1 className="text-3xl font-bold mb-1">Your Orders</h1>
          <p className="text-gray-400 text-sm">Track and manage all your purchases</p>

          {/* Quick stats */}
          {!loading && data && (
            <div className="flex gap-6 mt-6">
              {[
                { label: "Total Orders", value: totalOrders },
                { label: "Active",       value: activeOrders },
                { label: "Delivered",    value: deliveredOrders },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[#c8ad93]">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 pb-20">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20 text-gray-400 gap-2">
            <Loader2 className="animate-spin" size={20} /> Loading orders...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Empty */}
        {!loading && data?.orders?.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <PackageCheck size={52} className="mx-auto text-gray-200" />
            <p className="font-semibold text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400">Products you order will appear here</p>
            <a href="/landing/collection">
              <Button className="mt-2 bg-[#091422] hover:bg-[#1e3753] text-white">Browse Collection</Button>
            </a>
          </div>
        )}

        {/* Payment summary */}
        {!loading && data?.payment && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#c8ad93]/15 rounded-xl flex items-center justify-center">
                <CreditCard size={16} className="text-[#c8ad93]" />
              </div>
              <h2 className="font-bold text-gray-800">Payment Summary</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Paid",  value: `$${data.total_price.toFixed(2)}` },
                { label: "Method",      value: data.payment.method.replace("_", " ") },
                { label: "Card",        value: `•••• ${data.payment.card_last4 ?? "—"}` },
                { label: "Status",      value: data.payment.status },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="font-semibold text-gray-800 capitalize text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order cards */}
        {!loading && data?.orders?.map(order => (
          <OrderCard key={order.id} order={order} onCancel={cancelOrder} cancelling={cancelling} />
        ))}

      </div>
    </div>
  );
}