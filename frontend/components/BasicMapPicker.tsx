'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface BasicMapPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  locale: 'en' | 'ar';
}

export default function BasicMapPicker({ onLocationSelect, initialLocation, locale }: BasicMapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  // Default location (Riyadh, Saudi Arabia)
  const defaultLocation = { lat: 24.7136, lng: 46.6753 };
  const mapCenter = selectedLocation || defaultLocation;

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!mapRef.current || typeof window === 'undefined') return;

      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Add custom CSS to fix z-index issues
        if (!document.querySelector('#leaflet-fix-styles')) {
          const style = document.createElement('style');
          style.id = 'leaflet-fix-styles';
          style.textContent = `
            .leaflet-container {
              z-index: 1 !important;
            }
            .leaflet-control-container {
              z-index: 2 !important;
            }
            .leaflet-popup {
              z-index: 3 !important;
            }
            .leaflet-tooltip {
              z-index: 3 !important;
            }
          `;
          document.head.appendChild(style);
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 100));

        // Import Leaflet
        const L = (await import('leaflet')).default;

        if (!mounted) return;

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map with proper z-index control
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([mapCenter.lat, mapCenter.lng], selectedLocation ? 15 : 11);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        // Add marker if location is selected
        if (selectedLocation) {
          markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
        }

        // Add click handler
        mapInstanceRef.current.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          
          // Remove existing marker
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);

          try {
            // Get address from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${locale === 'ar' ? 'ar' : 'en'}`
            );
            
            let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            if (response.ok) {
              const data = await response.json();
              address = data.display_name || address;
            }

            const location = { lat, lng, address };
            setSelectedLocation(location);
            onLocationSelect(location);
          } catch (error) {
            console.error('Geocoding error:', error);
            const location = { lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
            setSelectedLocation(location);
            onLocationSelect(location);
          }
        });

        if (mounted) {
          setMapReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when selected location changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Add new marker and center map
      const L = require('leaflet');
      markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15);
    }
  }, [selectedLocation]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    setShowResults(false);

    // Update map
    if (mapInstanceRef.current) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
      const L = require('leaflet');
      markerRef.current = L.marker([location.lat, location.lng]).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView([location.lat, location.lng], 15);
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=sa&limit=5&accept-language=${locale === 'ar' ? 'ar' : 'en'}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const results: Location[] = data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.display_name
        }));
        
        setSearchResults(results);
        setShowResults(results.length > 0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(locale === 'en' 
        ? 'Geolocation is not supported by this browser.' 
        : 'الموقع الجغرافي غير مدعوم في هذا المتصفح.');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${locale === 'ar' ? 'ar' : 'en'}`
          );
          
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          if (response.ok) {
            const data = await response.json();
            address = data.display_name || address;
          }

          const location = { lat: latitude, lng: longitude, address };
          handleLocationSelect(location);
        } catch (error) {
          console.error('Geocoding error:', error);
          const location = { 
            lat: latitude, 
            lng: longitude, 
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          };
          handleLocationSelect(location);
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setGettingLocation(false);
        
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = locale === 'en' 
              ? 'Location access denied by user.' 
              : 'تم رفض الوصول إلى الموقع من قبل المستخدم.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = locale === 'en' 
              ? 'Location information is unavailable.' 
              : 'معلومات الموقع غير متاحة.';
            break;
          case error.TIMEOUT:
            errorMessage = locale === 'en' 
              ? 'Location request timed out.' 
              : 'انتهت مهلة طلب الموقع.';
            break;
          default:
            errorMessage = locale === 'en' 
              ? 'An unknown error occurred while retrieving location.' 
              : 'حدث خطأ غير معروف أثناء استرداد الموقع.';
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="w-full space-y-4 relative">
      {/* Search Bar and Location Button */}
      <div className="flex gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 2) {
                searchLocation(e.target.value);
              } else {
                setShowResults(false);
              }
            }}
            placeholder={locale === 'en' ? 'Search for a location...' : 'البحث عن موقع...'}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-neutral-400" />
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleLocationSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 line-clamp-2">{result.address}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        </form>

        {/* Use My Location Button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="flex-shrink-0 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-2"
          title={locale === 'en' ? 'Use my current location' : 'استخدم موقعي الحالي'}
        >
          {gettingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">
            {gettingLocation 
              ? (locale === 'en' ? 'Getting...' : 'جاري التحديد...')
              : (locale === 'en' ? 'My Location' : 'موقعي')
            }
          </span>
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-80 rounded-lg overflow-hidden border-2 border-neutral-300 relative bg-white shadow-sm">
        <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
        {!mapReady && (
          <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center" style={{ zIndex: 10 }}>
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-neutral-900 mb-1">
                {locale === 'en' ? 'Selected Location:' : 'الموقع المحدد:'}
              </p>
              <p className="text-sm text-neutral-600" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {selectedLocation.address}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {locale === 'en' ? 'Coordinates:' : 'الإحداثيات:'} {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-neutral-600 text-center p-3 bg-neutral-50 rounded-lg border">
        {locale === 'en' 
          ? 'Click on the map to select a location or search for an address above'
          : 'انقر على الخريطة لتحديد موقع أو ابحث عن عنوان أعلاه'}
      </div>
    </div>
  );
}