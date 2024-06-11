'use client'

import { useEffect, useState , useRef} from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { Box } from '@mui/material';
import Loading from './Loading';

const PlaceList = dynamic(() => import('./PlaceList'), { ssr: false });

declare global {
  interface Window {
    initMap: () => void;
  }
}

type LocationData = {
  name: string;
  lat: number;
  lng: number;
  url: string;
  marker_url: string;
  comment: string;
  address: string;
  webpage: string;
};

  interface SearchMapProps {
    likePlaceDatas?: LocationData[];
    matchPlaceDatas?: LocationData[];
  }

export default function Map() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const searchMarkersRef = useRef<google.maps.Marker[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const titleDivRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const toggleDrawer = (open?: boolean| React.SyntheticEvent) => {
    if (typeof open === 'boolean') {
      setIsDrawerOpen(open);
    } else {
      console.log('toggle');
      console.log('open', open);
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  useEffect(() => {
      window.initMap = function() {
        const styles = [
          {
            stylers: [{
              saturation: -50
            }]
          }
        ];
        const mapElement = document.getElementById('map');
        if (mapElement) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const currentLocation = { name: '現在地', lat: position.coords.latitude, lng: position.coords.longitude };
                const initialMap = new google.maps.Map(mapElement, {
                  center: { lat: currentLocation.lat, lng: currentLocation.lng },
                  zoom: 7,
                  styles: styles,
                  mapTypeControl: false,
                });
                setMap(initialMap);
              },
              (error) => {
                const initialMap = new google.maps.Map(mapElement, {
                  center: { lat: 34.7326198, lng: 135.7340145 },
                  zoom: 7,
                  styles: styles,
                  mapTypeControl: false,
                });
                setMap(initialMap);
              }
            );
          } else {
            const initialMap = new google.maps.Map(mapElement, {
              center: { lat: 35, lng: 139 },
              zoom: 7,
              styles: styles,
              mapTypeControl: false,
            });
            setMap(initialMap);
          }
        }
        setLoading(false);
  };

  if (document.querySelector(`script[src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANdk-7xD4KbN6tTR_3TODw0P1BUev42Cg&libraries=places"]`)) {
      if (typeof window.initMap === 'function') {
        window.initMap();
      }
    }
  
  }, []);

  return (
    <div id='container' style={{ display: 'flex' }}>
      {loading && <div style={{
        position: 'absolute',
        width: '100%',
        height: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        pointerEvents: 'none',
        }}>
          <Loading />
        </div>}
      <div id="map" style={{ width: '100vw', height: isDrawerOpen ? 'calc(100% - 45vh)' : '100%', transition: 'height 0.25s ease-in-out'}}></div>
      {map&&<PlaceList map={map} isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}/>}
    </div>
  );
}