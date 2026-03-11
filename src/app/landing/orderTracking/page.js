"use client"
import ClientNav from "@/app/navigation/ClientNav";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PackageCheck, Loader2, AlertCircle } from "lucide-react";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "shipped", "delivering", "delivered"];
const STATUS_LABELS = {
  pending:    "Pending",
  confirmed:  "Confirmed",
  preparing:  "Preparing",
  shipped:    "Shipped",
  delivering: "Delivering",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};

const CANCELLABLE = ["pending", "confirmed", "preparing"];

export default function OrderTracking() {
  const router = useRouter();
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [cancelling, setCancelling] = useState(null); // order id being cancelled
  const [error, setError]         = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) { router.push("/auth/login"); return; }

    axios.get(`http://127.0.0.1:8000/api/Orders/${userId}`)
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
      await axios.put(`http://127.0.0.1:8000/api/Orders/${orderId}/cancel`);
      setData(prev => ({
        ...prev,
        orders: prev.orders.map(o =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        ),
      }));
    } catch (err) {
      alert(err.response?.data?.detail || "Cannot cancel this order.");
    } finally {
      setCancelling(null);
    }
  };

  // ── Status timeline per order ──
  const Timeline = ({ status }) => {
    if (status === "cancelled") {
      return (
        <div className="flex items-center gap-2 text-red-500 font-medium text-sm py-2">
          <AlertCircle size={16} /> Order Cancelled
        </div>
      );
    }

    const currentIndex = STATUS_FLOW.indexOf(status);

    return (
      <>
        {/* Desktop */}
        <ol className="hidden md:flex items-center w-full text-xs font-medium text-center text-gray-500 mt-2">
          {STATUS_FLOW.map((s, i) => {
            const isDone   = i < currentIndex;
            const isActive = i === currentIndex;
            const isLast   = i === STATUS_FLOW.length - 1;
            return (
              <li
                key={s}
                className={`flex w-full items-center
                  ${!isLast ? `after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block after:ms-2 after:rounded-full
                    ${isDone ? "after:border-[#091422]" : "after:border-gray-200"}` : ""}
                `}
              >
                <div className="flex flex-col items-center gap-1 min-w-[52px]">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                    ${isDone   ? "bg-[#091422] border-[#091422] text-white" : ""}
                    ${isActive ? "bg-[#c8ad93] border-[#c8ad93] text-white" : ""}
                    ${!isDone && !isActive ? "bg-white border-gray-200 text-gray-400" : ""}
                  `}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className={`${isActive ? "text-[#091422] font-semibold" : isDone ? "text-[#091422]" : "text-gray-400"}`}>
                    {STATUS_LABELS[s]}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Mobile */}
        <div className="md:hidden mt-3 space-y-2">
          <div className="flex gap-2 flex-wrap">
            {STATUS_FLOW.map((s, i) => {
              const isDone   = i < currentIndex;
              const isActive = i === currentIndex;
              return (
                <span key={s} className={`px-2 py-1 rounded-full text-xs border
                  ${isDone   ? "bg-gray-100 border-[#091422] text-[#091422]" : ""}
                  ${isActive ? "bg-[#091422] text-white border-[#091422]" : ""}
                  ${!isDone && !isActive ? "bg-gray-50 border-gray-200 text-gray-400" : ""}
                `}>
                  {STATUS_LABELS[s]}
                </span>
              );
            })}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
            <div
              className="bg-[#091422] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / STATUS_FLOW.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">
            Step {currentIndex + 1} / {STATUS_FLOW.length} — <span className="font-medium text-[#091422]">{STATUS_LABELS[status]}</span>
          </p>
        </div>
      </>
    );
  };

  return (
    <div>
      <ClientNav />
      <div className="bg-[#F6F6F6] py-12 text-center relative border-b border-gray-100 mb-10">
        <h1 className="text-3xl font-bold text-[#091422] mb-2">Order Tracking</h1>
        <nav className="text-sm text-gray-500">
          <a href="/">Home</a> <span className="mx-2">/</span>
          <a href="/landing/cart">Shopping Cart</a> <span className="mx-2">/</span>
          <a href="/landing/checkout">Checkout</a> <span className="mx-2">/</span>
          <span className="text-gray-400">Order Tracking</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-6">

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center items-center py-20 text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Loading orders...
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>
        )}

        {/* ── Empty ── */}
        {!loading && data?.orders?.length === 0 && (
          <div className="text-center py-20 text-gray-400 space-y-2">
            <PackageCheck size={48} className="mx-auto text-gray-300" />
            <p className="font-medium">No orders yet.</p>
            <a href="/landing/collection" className="text-[#091422] underline text-sm">Browse our collection</a>
          </div>
        )}

        {/* ── Payment summary banner ── */}
        {!loading && data?.payment && (
          <div className="bg-[#c8ad93] rounded-2xl p-5 text-white space-y-1">
            <h2 className="font-bold text-[#091422] text-lg mb-2">Payment Summary</h2>
            <p><span className="font-semibold text-[#091422]">Total Paid:</span> ${data.total_price.toFixed(2)}</p>
            <p><span className="font-semibold text-[#091422]">Method:</span> {data.payment.method.replace("_", " ")}</p>
            <p><span className="font-semibold text-[#091422]">Card:</span> •••• {data.payment.card_last4}</p>
            <p>
              <span className="font-semibold text-[#091422]">Payment Status:</span>{" "}
              <span className="capitalize font-medium">{data.payment.status}</span>
            </p>
          </div>
        )}

        {/* ── Order cards ── */}
        {!loading && data?.orders?.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

            {/* Order header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Order <span className="text-[#091422]">#{order.id}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Order Total</p>
                <p className="text-xl font-bold text-[#091422]">${order.totalprice.toFixed(2)}</p>
              </div>
            </div>

            {/* Timeline */}
            <Timeline status={order.status} />

            {/* Product row */}
            <div className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
              <img
                src={order.product?.image || "/placeholder.png"}
                alt={order.product?.ProductName || "Product"}
                className="w-20 h-20 rounded-lg object-cover border border-gray-200 bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {order.product?.ProductName || `Product #${order.product_id}`}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Qty: <span className="font-medium">{order.product_qte}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Unit price: <span className="font-medium">${order.product?.price?.toFixed(2) ?? "—"}</span>
                </p>
              </div>
              <p className="font-bold text-gray-700 text-lg shrink-0">
                ${order.totalprice.toFixed(2)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.push("/landing/Contact")}>
                Contact Support
              </Button>
              {CANCELLABLE.includes(order.status) && (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={cancelling === order.id}
                  onClick={() => cancelOrder(order.id)}
                >
                  {cancelling === order.id
                    ? <><Loader2 size={14} className="animate-spin mr-1" /> Cancelling...</>
                    : "Cancel Order"
                  }
                </Button>
              )}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}