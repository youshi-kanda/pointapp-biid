import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Store {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  points: number;
  pointsRate: number;
  status: 'open' | 'closed' | 'closing_soon';
  phone?: string;
  website?: string;
  position: { lat: number; lng: number };
}

interface LeafletMapProps {
  stores: Store[];
  onStoreSelect: (store: Store | null) => void;
  selectedStore: Store | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ stores, onStoreSelect, selectedStore }) => {
  const center: [number, number] = [35.6762, 139.6503]; // Tokyo coordinates

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.position.lat, store.position.lng]}
          eventHandlers={{
            click: () => onStoreSelect(store),
          }}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-bold">{store.name}</h4>
              <p className="text-sm text-gray-600">{store.category}</p>
              <p className="text-sm">{store.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
