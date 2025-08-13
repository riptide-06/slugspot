"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

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

// Sample locations around UCSC campus
const sampleLocations: MapLocation[] = [
  {
    id: '1',
    name: 'Stevenson Coffee House',
    description: 'Popular coffee spot with great atmosphere',
    lat: 36.9914,
    lng: -122.0583,
    category: 'coffee',
    rating: 4.5,
    reviews: 23
  },
  {
    id: '2',
    name: 'Science & Engineering Library',
    description: 'Quiet study space with reliable WiFi',
    lat: 36.9995,
    lng: -122.0583,
    category: 'study',
    rating: 4.2,
    reviews: 45
  },
  {
    id: '3',
    name: 'Kresge Garden',
    description: 'Beautiful outdoor space for relaxation',
    lat: 36.9889,
    lng: -122.0647,
    category: 'recreation',
    rating: 4.8,
    reviews: 12
  },
  {
    id: '4',
    name: 'Cafe Iveta',
    description: 'Off-campus coffee shop near downtown',
    lat: 36.9741,
    lng: -122.0308,
    category: 'coffee',
    rating: 4.3,
    reviews: 67
  },
  {
    id: '5',
    name: 'Crown Dining Hall',
    description: 'Campus dining with various food options',
    lat: 36.9978,
    lng: -122.0547,
    category: 'food',
    rating: 3.9,
    reviews: 89
  }
];

const categoryColors = {
  coffee: '#8B4513',
  study: '#4A90E2',
  food: '#F5A623',
  service: '#7ED321',
  recreation: '#50E3C2',
  other: '#9013FE'
};

const categoryIcons = {
  coffee: '☕',
  study: '📚',
  food: '🍽️',
  service: '🏢',
  recreation: '🌳',
  other: '📍'
};

type Props = {
  locations?: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
  className?: string;
};

export default function GoogleMap({ 
  locations = sampleLocations, 
  onLocationClick,
  className = "w-full h-96 rounded-lg"
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      setError('Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 36.9914, lng: -122.0583 }, // UCSC campus center
          zoom: 14,
          styles: [
            {
              featureType: "poi.school",
              elementType: "geometry.fill",
              stylers: [{ color: "#0B3B76" }]
            }
          ]
        });
        setMap(mapInstance);
      }
    }).catch((error) => {
      setError(`Failed to load Google Maps: ${error.message}`);
    });
  }, []);

  // Add markers when map or locations change
  useEffect(() => {
    if (!map || !locations) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const filteredLocations = selectedCategory === 'all' 
      ? locations 
      : locations.filter(loc => loc.category === selectedCategory);

    const newMarkers = filteredLocations.map(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="${categoryColors[location.category]}" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${categoryIcons[location.category]}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-sm">${location.name}</h3>
            <p class="text-xs text-gray-600 mt-1">${location.description}</p>
            ${location.rating ? `
              <div class="flex items-center gap-1 mt-2 text-xs">
                <span class="text-yellow-500">${'★'.repeat(Math.round(location.rating))}</span>
                <span class="text-gray-500">${location.rating} (${location.reviews} reviews)</span>
              </div>
            ` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onLocationClick?.(location);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, locations, selectedCategory, onLocationClick]);

  if (error) {
    return (
      <div className={`${className} bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-red-600 text-sm font-medium">Map Error</p>
          <p className="text-slate-600 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const categories = [
    { key: 'all', label: 'All', icon: '🗺️' },
    { key: 'coffee', label: 'Coffee', icon: '☕' },
    { key: 'study', label: 'Study', icon: '📚' },
    { key: 'food', label: 'Food', icon: '🍽️' },
    { key: 'service', label: 'Services', icon: '🏢' },
    { key: 'recreation', label: 'Recreation', icon: '🌳' }
  ];

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat.key
                ? 'bg-brand text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div ref={mapRef} className={className} />
      
      {/* Legend */}
      <div className="text-xs text-slate-600">
        <p className="font-medium mb-1">Map Legend:</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <span key={category} className="flex items-center gap-1">
              <span style={{ color: categoryColors[category as keyof typeof categoryColors] }}>
                {icon}
              </span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}