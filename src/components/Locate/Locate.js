import React from 'react';

export default function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={(e) => {
        e.preventDefault()
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords.latitude, position.coords.longitude)
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}