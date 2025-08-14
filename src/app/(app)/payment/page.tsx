"use client";

import { useState } from "react";
import { CreditCard, Lock, CheckCircle, AlertCircle } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

type PaymentData = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock booking data - in real app this would come from booking flow
  const bookingDetails = {
    service: "Tutoring Session",
    date: "January 20, 2024",
    time: "2:00 PM",
    duration: "1 hour",
    amount: 25.00
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure
      if (Math.random() > 0.1) { // 90% success rate for demo
        setSuccess(true);
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (success) {
    return (
      <RequireAuth>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-600 mb-6">
              Your booking has been confirmed and you'll receive a confirmation email shortly.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-6 text-left">
              <h2 className="font-semibold text-slate-900 mb-4">Booking Confirmation</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Service:</span>
                  <span className="font-medium">{bookingDetails.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date & Time:</span>
                  <span className="font-medium">{bookingDetails.date} at {bookingDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">{bookingDetails.duration}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-slate-600">Amount Paid:</span>
                  <span className="font-semibold text-brand">${bookingDetails.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button className="px-6 py-2 bg-brand text-white rounded-lg hover:opacity-90">
                View My Bookings
              </button>
              <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h1>
          <p className="text-slate-600">Secure payment processing with 256-bit SSL encryption</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600">Secure Payment</span>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Information */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand" />
                    Card Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          cardNumber: formatCardNumber(e.target.value)
                        })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            setPaymentData({...paymentData, expiryDate: value});
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({
                            ...paymentData,
                            cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                          })}
                          placeholder="123"
                          maxLength={4}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                        placeholder="John Doe"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Billing Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={paymentData.billingAddress.street}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          billingAddress: {...paymentData.billingAddress, street: e.target.value}
                        })}
                        placeholder="123 Main St"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={paymentData.billingAddress.city}
                          onChange={(e) => setPaymentData({
                            ...paymentData,
                            billingAddress: {...paymentData.billingAddress, city: e.target.value}
                          })}
                          placeholder="Santa Cruz"
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={paymentData.billingAddress.state}
                          onChange={(e) => setPaymentData({
                            ...paymentData,
                            billingAddress: {...paymentData.billingAddress, state: e.target.value}
                          })}
                          placeholder="CA"
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={paymentData.billingAddress.zipCode}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          billingAddress: {...paymentData.billingAddress, zipCode: e.target.value}
                        })}
                        placeholder="95064"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-brand text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ${bookingDetails.amount.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Service:</span>
                  <span className="font-medium">{bookingDetails.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium">{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-medium">{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">{bookingDetails.duration}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium">${bookingDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-3 mt-3">
                    <span>Total:</span>
                    <span className="text-brand">${bookingDetails.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}