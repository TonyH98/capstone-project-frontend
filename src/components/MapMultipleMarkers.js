// Map component using React Google Maps API rendered on new event and event details page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Geocode from "react-geocode";
import { allEvents, gamingEvents } from '../assets/mapData'
import GamingEvents from './GamingEvents';
import AllEvents from './AllEvents';

function MultipleMarkers ({ filterEvents, events, filterCategories }) {

  const [ markers, setMarkers ] = useState([])
  const navigate = useNavigate()

  const mapStyles = {
    height: '300px',
    width: '600px'
  };

  const defaultCenter = {
    lat: 40.7032,
    lng: -73.9238
  };

  const getCoordinates = (event) => {
    // using Geocode API to convert address to coordinates on map
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

    // Get latitude & longitude from address
    Geocode.fromAddress(event.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        const newMarker = {
            id: event.id,
            title: event.title,
            position: {
                lat: lat,
                lng: lng
            }
        }
        // set all markers in state
        setMarkers([...markers, newMarker])
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    // reset markers each time useEffect is called
    setMarkers([])
    // get coordinates and info from each event displayed
      filterEvents.map((event) => {
        getCoordinates(event)
      })
  }, [filterEvents, filterCategories])

  const Markers = () =>
    markers.map((marker) => (
        <>
            <Marker 
                key={marker.id} 
                id={marker.id} 
                position={marker.position} 
                title={marker.title} 
                onClick={() => {navigate(`/events/${marker.id}`)}}
            >
            {/* <InfoWindow
                position={marker.position}
            >
                <div>
                    <h1 onClick={() => navigate(`/events/${marker.id}`)}>{marker.title}</h1>
                </div>
            </InfoWindow> */}
            </Marker>
        </>

    ));

  return (
    <div className="w-[600px] m-auto">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={10}
          center={defaultCenter}
          >
        {
          filterCategories?.includes("Gaming") ?
            <GamingEvents />
              : <AllEvents />
        }
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MultipleMarkers;