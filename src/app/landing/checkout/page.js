"use client"
import React, { useState, useEffect } from 'react';
import { ChevronRight, CreditCard, User, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientNav from '@/app/navigation/ClientNav';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [step, setStep]               = useState(1);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [cartItems, setCartItems]     = useState([]);
  const [cartSummary, setCartSummary] = useState({ subtotal: 0, discount: 0 });
  const [customerId, setCustomerId]   = useState(null);

  // ── Payment form state ──
  const [form, setForm] = useState({
    cardholder:  "",
    card_number: "",
    expiry:      "",
    cvv:         "",
    method:      "credit_card",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "card_number") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const getStepClass = (s) => s <= step ? "bg-[#1e3753] text-white" : "bg-gray-200 text-gray-500";
  const getLineClass = (s) => s < step  ? "border-[#1e3753]" : "border-gray-200";

  // ── Load customer + cart summary ──
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) { router.push("/auth/login"); return; }
    setCustomerId(parseInt(userId));

    // ✅ Fetch cart items to display in summary
    axios.get(`http://127.0.0.1:8000/api/Sales/${userId}`)
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : res.data.orders ?? [];
        setCartItems(items);
        const subtotal = items.reduce((a, i) => a + (i.subtotal ?? i.totalprice ?? 0), 0);
        const discount = items.reduce((a, i) => a + (i.discount || 0), 0);
        setCartSummary({ subtotal, discount });
      })
      .catch(() => setCartSummary({ subtotal: 0, discount: 0 }));
  }, []);

  // ── Place order — sends payment info to backend ──
  const placeOrder = async () => {
    setError("");

    if (form.card_number.length !== 16) { setError("Card number must be 16 digits."); return; }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))  { setError("Expiry must be MM/YY."); return; }
    if (form.cvv.length < 3)                   { setError("CVV must be 3 or 4 digits."); return; }
    if (!form.cardholder.trim())               { setError("Cardholder name is required."); return; }

    try {
      setLoading(true);

      // ✅ POST to create_order — this creates orders + saves payment in one call
      const res = await axios.post(
        `http://127.0.0.1:8000/api/Sales/create_order/${customerId}`,
        {
          cardholder:  form.cardholder,
          card_number: form.card_number,   // backend extracts last 4 digits
          expiry:      form.expiry,
          cvv:         form.cvv,
          method:      form.method,
        }
      );

      setOrderResult(res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) { setStep(2); }
    if (step === 2) { placeOrder(); }
  };

  const total = cartSummary.subtotal - cartSummary.discount;

  return (
    <div>
      <ClientNav />
      <div className="bg-[#F9F9F9] min-h-screen font-sans pb-20">

        {/* Page Header */}
        <div className="bg-[#F6F6F6] py-12 text-center relative border-b border-gray-100 mb-10">
          <h1 className="text-3xl font-bold text-[#091422] mb-2">Checkout</h1>
          <nav className="text-sm text-gray-500">
            <a href="/">Home</a> <span className="mx-2">/</span>
            <a href="/landing/cart">Shopping Cart</a> <span className="mx-2">/</span>
            <span className="text-gray-400">Checkout</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Steps */}
          <div className="lg:col-span-8 space-y-8">

            {/* Progress Bar */}
            <ol className="flex items-center w-full space-x-4 mb-10 px-4">
              <li className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b ${getLineClass(1)} after:border-4 after:inline-block after:ms-4 after:rounded-full`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${getStepClass(1)}`}>
                  <User size={20} />
                </span>
              </li>
              <li className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b ${getLineClass(2)} after:border-4 after:inline-block after:ms-4 after:rounded-full`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${getStepClass(2)}`}>
                  <CreditCard size={20} />
                </span>
              </li>
              <li className="flex items-center">
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${getStepClass(3)}`}>
                  <CheckCircle size={20} />
                </span>
              </li>
            </ol>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

              {/* STEP 1 — Shipping */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-gray-800">User Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="text" placeholder="First Name" />
                    <Input type="text" placeholder="Last Name" />
                    <Input type="email" placeholder="Email Address" className="md:col-span-2" />
                    <Input type="text" placeholder="Shipping Address" className="md:col-span-2" />
                  </div>
                </div>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-800">Payment Information</h2>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      type="text"
                      name="cardholder"
                      placeholder="Cardholder Name"
                      value={form.cardholder}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <Input
                        type="text"
                        name="card_number"
                        placeholder="Card Number (16 digits)"
                        value={form.card_number}
                        onChange={handleChange}
                        className="w-full pr-12"
                      />
                      <CreditCard className="absolute right-4 top-2.5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={form.expiry}
                        onChange={handleChange}
                      />
                      <Input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={form.cvv}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Payment method selector */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {["credit_card", "debit_card", "paypal", "cash"].map(m => (
                        <button
                          key={m}
                          onClick={() => setForm(p => ({ ...p, method: m }))}
                          className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors capitalize
                            ${form.method === m
                              ? "border-[#1e3753] bg-[#1e3753] text-white"
                              : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                        >
                          {m.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Confirmation */}
              {step === 3 && (
                <div className="text-center py-10 space-y-4 animate-in zoom-in duration-500">
                  <div className="flex justify-center text-green-600"><CheckCircle size={80} /></div>
                  <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
                  <p className="text-gray-500">
                    {orderResult?.order_ids?.length} order(s) placed successfully.
                  </p>
                  <div className="bg-gray-50 p-6 rounded-xl inline-block text-left w-full max-w-md space-y-2">
                    <p className="font-bold mb-2">Payment Details</p>
                    <p className="text-sm text-gray-600">
                      Amount paid: <span className="font-semibold text-gray-800">${orderResult?.total_price?.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Cardholder: <span className="font-semibold text-gray-800">{orderResult?.payment?.cardholder}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Card ending in: <span className="font-semibold text-gray-800">•••• {orderResult?.payment?.card_last4}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Method: <span className="font-semibold text-gray-800 capitalize">{orderResult?.payment?.method?.replace("_", " ")}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-semibold text-green-600 capitalize">{orderResult?.payment?.status}</span>
                    </p>
                  </div>
                  <Button>
                    <a href="/landing/orderTracking">Track My Orders</a>
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 flex justify-between">
                {step > 1 && step < 3 && (
                  <Button onClick={() => { setError(""); setStep(step - 1); }}>
                    Back
                  </Button>
                )}
                {step < 3 && (
                  <Button
                    onClick={handleNext}
                    className="ml-auto"
                    disabled={loading}
                  >
                    {loading
                      ? <><Loader2 size={16} className="mr-2 animate-spin" /> Processing...</>
                      : <>{step === 2 ? "Place Order" : "Next Step"} <ChevronRight size={18} /></>
                    }
                  </Button>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-bold">${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Discount</span>
                  <span className="text-gray-400 font-bold">-${cartSummary.discount.toFixed(2)}</span>
                </div>
                <hr className="border-gray-50" />
                <div className="flex justify-between text-gray-800 text-2xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default page;