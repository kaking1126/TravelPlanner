import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cities } from '../cities';
import { travelSpots, TravelSpot } from '../spots';

interface MapProps {
  onSelectSpot: (spot: TravelSpot) => void;
}

const MapEvents: React.FC<{ onSelectSpot: (spot: TravelSpot) => void }> = ({ onSelectSpot }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    const handleZoomEnd = () => {
      setZoomLevel(map.getZoom());
    };
    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

  const handleCityMarkerClick = (position: [number, number]) => {
    map.flyTo(position, 13);
  };

  return (
    <>
      {cities.map((city) => (
        <Marker key={city.id} position={city.position} eventHandlers={{
          click: () => {
            handleCityMarkerClick(city.position);
          }
        }}>
          <Popup>{city.name}</Popup>
        </Marker>
      ))}
      {zoomLevel > 12 && travelSpots.map((spot) => (
        <Marker key={spot.id} position={spot.position} eventHandlers={{
          click: () => {
            onSelectSpot(spot);
          }
        }}>
          <Popup>{spot.name}</Popup>
        </Marker>
      ))}
    </>
  );
}

const Map: React.FC<MapProps> = ({ onSelectSpot }) => {
  return (
    <MapContainer center={[25, 0]} zoom={3} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onSelectSpot={onSelectSpot} />
    </MapContainer>
  );
};

export default Map;
