import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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

interface GoogleMapProps {
  stores: Store[];
  onStoreSelect: (store: Store | null) => void;
  selectedStore: Store | null;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 35.6895,
  lng: 139.6917
};

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ stores, onStoreSelect, selectedStore }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyA0sIJoIzT0Z6Bsj3Sw6LEh0_tLixgxMpY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={store.position}
            onClick={() => onStoreSelect(store)}
          />
        ))}
        
        {selectedStore && (
          <InfoWindow
            position={selectedStore.position}
            onCloseClick={() => onStoreSelect(null)}
          >
            <div className="p-2">
              <h4 className="font-bold text-gray-800">{selectedStore.name}</h4>
              <p className="text-sm text-gray-600">{selectedStore.category}</p>
              <p className="text-sm text-gray-700">{selectedStore.address}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm ml-1">{selectedStore.rating} ({selectedStore.reviews}件)</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
