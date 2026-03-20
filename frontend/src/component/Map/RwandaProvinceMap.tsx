import React, { useCallback, useMemo } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

// Rwanda province coordinates (approximate centers)
const PROVINCE_COORDINATES: Record<string, google.maps.LatLngLiteral> = {
  'Kigali': { lat: -1.9441, lng: 30.0619 },
  'East': { lat: -2.0000, lng: 30.9000 },
  'West': { lat: -2.2000, lng: 29.7000 },
  'North': { lat: -1.5000, lng: 29.8000 },
  'South': { lat: -2.6000, lng: 29.7000 }
};

const RWANDA_CENTER = { lat: -1.9403, lng: 29.8739 };

interface ProvinceData {
  province: string;
  value: number;
  color: string;
}

interface RwandaMapProps {
  data: ProvinceData[];
  title?: string;
}

interface MapComponentProps extends RwandaMapProps {
  apiKey: string;
}

// Custom marker component
const ProvinceMarker = ({ 
  position, 
  value, 
  province, 
  color, 
  map 
}: { 
  position: google.maps.LatLngLiteral;
  value: number;
  province: string;
  color: string;
  map: google.maps.Map;
}) => {
  const markerRef = React.useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  React.useEffect(() => {
    if (!map) return;

    // Create custom HTML element for the marker
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cssText = `
      background-color: ${color};
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 12px;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      text-align: center;
      min-width: 60px;
      transition: transform 0.2s ease;
    `;
    markerElement.innerHTML = `
      <div style="font-size: 10px; opacity: 0.9;">${province}</div>
      <div style="font-size: 14px; font-weight: bold;">${value.toFixed(1)}%</div>
    `;

    // Add hover effects
    markerElement.addEventListener('mouseenter', () => {
      markerElement.style.transform = 'scale(1.1)';
      markerElement.style.zIndex = '1000';
    });

    markerElement.addEventListener('mouseleave', () => {
      markerElement.style.transform = 'scale(1)';
      markerElement.style.zIndex = 'auto';
    });

    // Create the advanced marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerElement,
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, position, value, province, color]);

  return null;
};

// Main map component
const MapComponent: React.FC<{ data: ProvinceData[]; title?: string }> = ({ data, title }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  React.useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center: RWANDA_CENTER,
        zoom: 8,
        mapId: 'rwanda-province-map',
        styles: [
          {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2937' }, { weight: 2 }]
          },
          {
            featureType: 'administrative.province',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#6b7280' }, { weight: 1 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f9fafb' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#dbeafe' }]
          }
        ],
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMap(newMap);
    }
  }, [ref, map]);

  const dataMap = useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.province] = item;
      return acc;
    }, {} as Record<string, ProvinceData>);
  }, [data]);

  return (
    <>
      <div ref={ref} style={{ width: '100%', height: '400px', borderRadius: '8px' }} />
      {map && Object.entries(PROVINCE_COORDINATES).map(([province, position]) => {
        const provinceData = dataMap[province];
        if (!provinceData) return null;

        return (
          <ProvinceMarker
            key={province}
            position={position}
            value={provinceData.value}
            province={province}
            color={provinceData.color}
            map={map}
          />
        );
      })}
    </>
  );
};

// Wrapper component with Google Maps API
const RwandaProvinceMap: React.FC<MapComponentProps> = ({ data, title, apiKey }) => {
  const render = useCallback((status: string) => {
    if (status === 'LOADING') {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-sm">Loading map...</div>
        </div>
      );
    }
    if (status === 'FAILURE') {
      return (
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
          <div className="text-red-500 text-sm">Error loading map</div>
        </div>
      );
    }
    return <MapComponent data={data} title={title} />;
  }, [data, title]);

  return (
    <Wrapper
      apiKey={apiKey}
      libraries={['marker']}
      render={render}
    />
  );
};

export default RwandaProvinceMap;