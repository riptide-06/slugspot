"use client";

import { useState } from "react";
import GoogleMap from "@/components/GoogleMap";

type MapLocation = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: 'coffee' | 'study' | 'food' | 'service' | 'recreation' | 'other';
  rating?: number;
  reviews?: number;
};

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Interactive Campus Map</h1>
            <p className="text-slate-600 mt-1">
              Discover coffee shops, study spots, dining, and services on and around campus
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card">
              <GoogleMap
                onLocationClick={handleLocationClick}
                className="w-full h-[500px] rounded-lg"
              />
            </div>
          </div>

          {/* Location Details Sidebar */}
          <div className="space-y-4">
            {selectedLocation ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedLocation.name}
                </h3>
                <p className="text-slate-600 mt-2 text-sm">
                  {selectedLocation.description}
                </p>
                
                {selectedLocation.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      <span className="text-yellow-500">
                        {'★'.repeat(Math.round(selectedLocation.rating))}
                      </span>
                      <span className="text-slate-300">
                        {'★'.repeat(5 - Math.round(selectedLocation.rating))}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">
                      {selectedLocation.rating} ({selectedLocation.reviews} reviews)
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                    style={{ 
                      backgroundColor: `${selectedLocation.category === 'coffee' ? '#8B4513' : 
                        selectedLocation.category === 'study' ? '#4A90E2' :
                        selectedLocation.category === 'food' ? '#F5A623' :
                        selectedLocation.category === 'service' ? '#7ED321' :
                        selectedLocation.category === 'recreation' ? '#50E3C2' : '#9013FE'}20`,
                      color: selectedLocation.category === 'coffee' ? '#8B4513' : 
                        selectedLocation.category === 'study' ? '#4A90E2' :
                        selectedLocation.category === 'food' ? '#F5A623' :
                        selectedLocation.category === 'service' ? '#7ED321' :
                        selectedLocation.category === 'recreation' ? '#50E3C2' : '#9013FE'
                    }}
                  >
                    {selectedLocation.category.charAt(0).toUpperCase() + selectedLocation.category.slice(1)}
                  </span>
                </div>

                <button className="w-full mt-4 bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition">
                  View Details & Reviews
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Explore Campus
                </h3>
                <p className="text-slate-600 text-sm">
                  Click on any marker on the map to see details about that location.
                </p>
                
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-slate-900 text-sm">Quick Tips:</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Use category filters to find specific types of places</li>
                    <li>• Zoom in/out to explore different areas</li>
                    <li>• Click markers for ratings and reviews</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Campus Highlights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Coffee Shops</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Study Spaces</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Dining Options</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Services</span>
                  <span className="text-sm font-medium">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}