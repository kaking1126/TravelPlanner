import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { TravelSpot, travelSpots } from '../spots';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface MapProps {
  onSelectSpot: (spot: TravelSpot) => void;
}

const MapComponent: React.FC<MapProps> = ({ onSelectSpot }) => {
  const globeEl = useRef<any>();
  const [width, setWidth] = useState(window.innerWidth);
  const [hoveredSpot, setHoveredSpot] = useState<TravelSpot | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      // Enable zoom and pan
      globeEl.current.controls().enableZoom = true;
    }
  }, []);

  const spotData = useMemo(() => travelSpots.map(spot => ({
    ...spot,
    lat: spot.position[0],
    lng: spot.position[1],
    size: 1.2, // Increased size for easier clicking
    color: '#F97316' // CTA Orange
  })), []);

  return (
    <div className="relative w-full h-[600px] bg-[#000011] rounded-xl overflow-hidden shadow-2xl border border-border group">
      <div className="absolute top-4 left-4 z-10 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg max-w-xs pointer-events-none select-none">
        <Title level={4} className="!text-white !mb-1 font-heading">Explore the World</Title>
        <Text className="text-gray-200 text-sm">Drag to rotate. Click on orange markers to select a destination.</Text>
      </div>

      {hoveredSpot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-10 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-white/50"
        >
          <div className="h-32 overflow-hidden">
            <img src={hoveredSpot.imageUrl} alt={hoveredSpot.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-heading font-bold text-lg text-primary mb-1">{hoveredSpot.name}</h3>
            <p className="text-xs text-text-secondary mb-3">{hoveredSpot.description}</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              block
              onClick={() => onSelectSpot(hoveredSpot)}
              className="bg-cta hover:bg-orange-600 border-none"
            >
              Select Destination
            </Button>
          </div>
        </motion.div>
      )}

      <Globe
        ref={globeEl}
        width={width > 1200 ? width - 600 : width - 100}
        height={600}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#3B82F6"
        atmosphereAltitude={0.15}

        // Points Layer
        pointsData={spotData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.08}
        pointRadius="size"
        pointsMerge={false} // Disable merge to ensure individual clickability

        // Interaction
        onPointHover={(point: any) => {
          setHoveredSpot(point as TravelSpot || null);
          document.body.style.cursor = point ? 'pointer' : 'default';
          if (globeEl.current) {
            globeEl.current.controls().autoRotate = !point;
          }
        }}
        onPointClick={(point: any) => {
          // Ensure the point is valid before triggering selection
          if (point) {
            onSelectSpot(point as TravelSpot);
          }
        }}

        // Labels Layer - Adding this ensures labels are also interactive if they overlap
        labelsData={spotData}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={() => "rgba(255, 255, 255, 0.9)"}
        labelResolution={2}
        onLabelClick={(label: any) => {
          if (label) {
            onSelectSpot(label as TravelSpot);
          }
        }}
      />
    </div>
  );
};

export default MapComponent;