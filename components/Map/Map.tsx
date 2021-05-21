import { useThemeMode } from 'hooks';
import { ReactNode, useEffect, useState } from 'react';
import MapGL, { FlyToInterpolator, GeolocateControl, NavigationControl } from 'react-map-gl';
import { Marker } from './Marker';
import { Popup } from './Popup';
import { easeCubicOut } from 'd3-ease';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmluaWNpdXNscCIsImEiOiJja250em91Mm8wNnZ3MzNsZGZxZTkxNGtzIn0.Q7ihAOcitydcdNMLFq74AQ';

const MAPBOX_THEME = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/viniciuslp/cko0cgswz0mim17mkh56px5pa',
};

export interface MapProps {
  children?: ReactNode;
  geolocateControl?: true;
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

export const Map = ({ children, latitude = -14.2401, longitude = -53.1805, zoom = 3, geolocateControl }: MapProps) => {
  const { currentMode } = useThemeMode();
  const [mapStyle, setMapStyle] = useState(MAPBOX_THEME.light);

  useEffect(() => {
    if (currentMode === 'light') setMapStyle(MAPBOX_THEME.light);
    if (currentMode === 'dark') setMapStyle(MAPBOX_THEME.dark);
  }, [currentMode]);

  const [viewport, setViewPort] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: zoom,
    bearing: 0,
    pitch: 0,
    transitionInterpolator: undefined,
    transitionDuration: undefined,
    transitionEasing: undefined,
  });

  const _flyTo = (latitude: number, longitude: number, zoom?: number) => {
    setViewPort({
      ...viewport,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom || undefined,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 'auto',
      transitionEasing: easeCubicOut,
    });
  };

  useEffect(() => {
    _flyTo(latitude, longitude, zoom);
  }, [latitude, longitude, zoom]);

  const _onViewportChange = (viewport: any) => setViewPort({ ...viewport });

  return (
    <MapGL
      {...viewport}
      width='100%'
      height='100%'
      className='rounded'
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle={mapStyle}
      onViewportChange={_onViewportChange}
    >
      {geolocateControl && (
        <GeolocateControl
          className='float-left m-1 p-1'
          positionOptions={{ enableHighAccuracy: false }}
          trackUserLocation={true}
        />
      )}
      {children}
    </MapGL>
  );
};

export default Map;

Map.Marker = Marker;
Map.Popup = Popup;
