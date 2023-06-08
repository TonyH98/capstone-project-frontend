// Map component using React Google Maps API rendered on new event and event details page
import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function Map({ mapWidth, mapHeight, mapLat, mapLng }) {
    const containerStyle = {
      width: mapWidth,
      height: mapHeight,
    };
    
    const center = {
      lat: mapLat,
      lng: mapLng
    };
  
  const [map, setMap] = useState(null)

    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })

    const onLoad = useCallback(function callback(map) {
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
              zoom={15}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
            { /* Child components, such as markers, info windows, etc. */ }
            <Marker
              onLoad={onLoad} 
              position={center}
            />
          </GoogleMap>
        </div>
      ) : <div>Map Not Loaded</div>
}

export default Map;