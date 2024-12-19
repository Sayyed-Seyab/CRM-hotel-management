import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "./location.css"; // Ensure this file contains any additional global styles.
import "leaflet/dist/leaflet.css"


const LocationPicker = ({location, setLocation,setFormData }) => {
 

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const newLocation = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };
        setLocation(newLocation);
         // Update formData state with the new location
         setFormData((prevFormData) => ({
            ...prevFormData,
            location: newLocation,
        }));
        // onChange(newLocation.latitude, newLocation.longitude);
      },
    });

    return location.latitude && location.longitude ? (
      <Marker position={[location.latitude, location.longitude]} />
    ) : null;
  };
  const position = [51.505, -0.09]

  return (
    <div className="location-picker">
      {/* <div className="location-info">
        <label className="label">Selected Latitude:</label>
        <input
          type="text"
          className="input-field"
          value={location.latitude}
          readOnly
        />
        <label className="label">Selected Longitude:</label>
        <input
          type="text"
          className="input-field"
          value={location.longitude}
          readOnly
        />
      </div> */}
      <div className="map-container">
        <MapContainer
         center={position}
        //  scrollWheelZoom={false}
          zoom={7}
        //   style={{width:'100%', height:"100%"}}
          className="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
