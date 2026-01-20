import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { City, cities } from '../cities';
import { Typography, Input, AutoComplete } from 'antd';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const { Title } = Typography;

interface GlobeSelectorProps {
  onSelectCity: (city: City) => void;
}

const GlobeSelector: React.FC<GlobeSelectorProps> = ({ onSelectCity }) => {
  const globeEl = useRef<any>();
  const [width, setWidth] = useState(window.innerWidth);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);

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
      globeEl.current.controls().enableZoom = false; 
    }
  }, []);

  const cityData = useMemo(() => cities.map(city => ({
    ...city,
    lat: city.position[0],
    lng: city.position[1],
    size: 1.5, 
    color: '#3B82F6' 
  })), []);

  const handleSearchSelect = (value: string) => {
      const city = cities.find(c => c.name === value);
      if (city) {
          onSelectCity(city);
          if (globeEl.current) {
              globeEl.current.pointOfView({ lat: city.position[0], lng: city.position[1], altitude: 1.5 }, 1000);
          }
      }
  };

  const cityOptions = cities.map(city => ({ value: city.name, label: city.name }));

  return (
    <div className="relative w-full h-[500px] bg-[#000011] rounded-xl overflow-hidden shadow-2xl border border-border group mb-8">
        {/* Search Overlay - Positioned securely and styled to avoid hover conflicts */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-auto">
             <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-xl flex items-center transition-all hover:bg-white/20 focus-within:bg-white/20">
                <Search className="text-white ml-3 mr-2 w-5 h-5" />
                <AutoComplete
                    options={cityOptions}
                    style={{ width: '100%' }}
                    onSelect={handleSearchSelect}
                    placeholder="Search for a city..."
                    bordered={false}
                    className="text-white placeholder-white"
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    popupClassName="z-50" 
                >
                    <Input className="bg-transparent text-white placeholder-gray-300 border-none focus:ring-0 text-lg font-heading" />
                </AutoComplete>
             </div>
        </div>

        <div className="absolute top-4 left-4 z-10 p-4 pointer-events-none select-none">
             <Title level={4} className="!text-white !mb-1 font-heading drop-shadow-md">Select Destination</Title>
        </div>

        {hoveredCity && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/50 pointer-events-none"
            >
                <h3 className="font-heading font-bold text-xl text-primary m-0 text-center">{hoveredCity.name}</h3>
            </motion.div>
        )}

        <Globe
            ref={globeEl}
            width={width > 1200 ? width - 400 : width - 50} 
            height={500}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            atmosphereColor="#3B82F6"
            atmosphereAltitude={0.15}
            
            // Points Layer
            pointsData={cityData}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.08}
            pointRadius="size"
            pointsMerge={false} 
            
            // Interaction
            onPointHover={(point: any) => {
                setHoveredCity(point as City || null);
                document.body.style.cursor = point ? 'pointer' : 'default';
                if (globeEl.current) {
                    globeEl.current.controls().autoRotate = !point;
                }
            }}
            onPointClick={(point: any) => {
                if (point) {
                    onSelectCity(point as City);
                }
            }}

            // Labels
            labelsData={cityData}
            labelLat="lat"
            labelLng="lng"
            labelText="name"
            labelSize={2.0}
            labelDotRadius={1.0}
            labelColor={() => "rgba(255, 255, 255, 1)"}
            labelResolution={2}
            onLabelClick={(label: any) => {
                 if (label) {
                    onSelectCity(label as City);
                }
            }}
        />
    </div>
  );
};

export default GlobeSelector;
