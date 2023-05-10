// Map component using React Google Maps API rendered on events page and events details page
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useState, useCallback } from 'react'

// variables to configure map styling and center
const containerStyle = {
  width: '500px',
  height: '500px',
};

const center = {
  lat: 40.7127837,
  lng: -74.0059413
};

function Map() {

    const [map, setMap] = useState(null)

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <div>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={8}
            onLoad={onLoad}
            onUnmount={onUnmount}
            >
            { /* Child components, such as markers, info windows, etc. */ }
            <></>
          </GoogleMap>
        </div>
      ) : <div>Not Loaded</div>
}

export default Map;