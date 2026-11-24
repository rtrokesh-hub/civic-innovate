import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { MapPin, Loader2, Navigation, Crosshair } from 'lucide-react';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PinPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export const PinPicker: React.FC<PinPickerProps> = ({
  initialLat = 12.9716, // Bengaluru center
  initialLng = 77.5946,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [address, setAddress] = useState<string>('Bengaluru Center, Karnataka');
  const [geocoding, setGeocoding] = useState<boolean>(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    setGeocoding(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const displayAddress = res.data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(displayAddress);
      onLocationSelect(lat, lng, displayAddress);
    } catch {
      const fallback = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(fallback);
      onLocationSelect(lat, lng, fallback);
    } finally {
      setGeocoding(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });

    return <Marker position={position} icon={defaultIcon} />;
  };

  return (
    <div className="space-y-3">
      <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200/90 relative shadow-inner">
        {/* Floating helper tag */}
        <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center space-x-1.5">
          <Crosshair className="w-3.5 h-3.5 text-teal-600" />
          <span>Click map to place pin</span>
        </div>

        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5 truncate">
          <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
          </div>
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pin-Drop Location:</span>
            <span className="text-slate-800 font-semibold truncate block">{address}</span>
          </div>
        </div>
        {geocoding && (
          <div className="flex items-center space-x-1.5 text-teal-700 text-[11px] font-medium flex-shrink-0">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Resolving...</span>
          </div>
        )}
      </div>
    </div>
  );
};
