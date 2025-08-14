"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, User, CreditCard } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

type BookingData = {
  service: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  notes: string;
};

const services = [
  { id: "tutoring", name: "Tutoring Session", price: 25, duration: "1 hour" },
  { id: "study-room", name: "Study Room Booking", price: 0, duration: "2 hours" },
  { id: "equipment", name: "Equipment Rental", price: 15, duration: "1 day" },
  { id: "consultation", name: "Academic Consultation", price: 0, duration: "30 minutes" }
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

export default function BookingPage() {
  const [bookingData, setBookingData] = useState<BookingData>({
    service: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    notes: ""
  });
  const [step, setStep] = useState(1);

  const selectedService = services.find(s => s.id === bookingData.service);
  const totalPrice = selectedService?.price || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process booking
      console.log("Booking submitted:", bookingData);
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Book a Service</h1>
          <p className="text-slate-600">Schedule appointments and reserve resources</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-brand text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {num}
                </div>
                <span className={`ml-2 text-sm ${step >= num ? 'text-brand' : 'text-slate-600'}`}>
                  {num === 1 ? 'Service' : num === 2 ? 'Details' : 'Confirm'}
                </span>
                {num < 3 && <div className="w-16 h-px bg-slate-200 mx-4" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-brand" />
                  Select a Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <label key={service.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={bookingData.service === service.id}
                        onChange={(e) => setBookingData({...bookingData, service: e.target.value})}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-xl p-4 transition ${
                        bookingData.service === service.id
                          ? 'border-brand bg-brand/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <h3 className="font-medium text-slate-900">{service.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">Duration: {service.duration}</p>
                        <p className="text-sm font-medium text-brand mt-2">
                          {service.price === 0 ? 'Free' : `$${service.price}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand" />
                  Choose Date & Time
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time
                    </label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={bookingData.location}
                    onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
                    placeholder="e.g., Science Library, Room 101"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand" />
                  Booking Summary
                </h2>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium">{new Date(bookingData.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time:</span>
                    <span className="font-medium">{bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{selectedService?.duration}</span>
                  </div>
                  {bookingData.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{bookingData.location}</span>
                    </div>
                  )}
                  <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-brand">
                      {totalPrice === 0 ? 'Free' : `$${totalPrice}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={
                  (step === 1 && !bookingData.service) ||
                  (step === 2 && (!bookingData.date || !bookingData.time))
                }
                className="ml-auto px-6 py-2 bg-brand text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 3 ? 'Confirm Booking' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
}