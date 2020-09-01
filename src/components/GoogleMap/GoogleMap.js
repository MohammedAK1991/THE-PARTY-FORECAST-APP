import React from "react";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles2 from "../../MapThemes/mapStyles2.js";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles2,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 41.3851,
  lng: 2.1734,
};

const mapRef = React.useRef();
const onMapLoad = React.useCallback((map) => {
  mapRef.current = map;
}, []);

const panTo = React.useCallback(({ lat, lng }) => {
  setTimeout(() => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(17);
  }, 1000)
}, []);

const { isLoaded, loadError } = useLoadScript({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries,
});

if (loadError) return "Error";
if (!isLoaded) return "Loading...";

