import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TravelSpot } from '../spots';
import { City } from '../cities';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing up in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const { Title, Text } = Typography;

interface CityDetailMapProps {
    selectedCity: City | null;
    spots: TravelSpot[];
    onSelectSpot: (spot: TravelSpot) => void;
}

// Component to handle map view updates
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const CityDetailMap: React.FC<CityDetailMapProps> = ({ selectedCity, spots, onSelectSpot }) => {
    const center: [number, number] = selectedCity ? selectedCity.position : [20, 0];
    const zoom = selectedCity ? 12 : 2;

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-border relative">
            {!selectedCity && (
                <div className="absolute inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-6 rounded-xl shadow-2xl text-center">
                        <Title level={3} className="!text-primary font-heading !mb-2">Select a City</Title>
                        <Text className="text-gray-500">Please select a city from the globe above to view attractions.</Text>
                    </div>
                </div>
            )}
            
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {selectedCity && <MapUpdater center={selectedCity.position} zoom={13} />}

                {spots.map(spot => (
                    <Marker key={spot.id} position={spot.position}>
                        <Popup>
                           <div className="min-w-[200px]">
                                <img src={spot.imageUrl} alt={spot.name} className="w-full h-32 object-cover rounded-md mb-2" />
                                <h3 className="font-bold text-lg mb-1">{spot.name}</h3>
                                <p className="text-xs text-gray-600 mb-2">{spot.description}</p>
                                <Button 
                                    type="primary" 
                                    size="small" 
                                    icon={<PlusOutlined />} 
                                    block
                                    onClick={() => onSelectSpot(spot)}
                                >
                                    Add to Plan
                                </Button>
                           </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default CityDetailMap;