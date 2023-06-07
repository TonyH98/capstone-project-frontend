// Map component using React Google Maps API rendered on new event and event details page
import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
// import { Marker } from '@react-google-maps/api';

function MultipleMarkers({ filterEvents }) {
    console.log(filterEvents)
    const containerStyle = {
      width: 600,
      height:300,
    };
    
    const center = {
      lat: 40.7032,
      lng: -73.9238
    };

    const center2 = {
        lat: 40.7205,
        lng: -73.8797
    };

    const center3 = {
        lat: 40.7826,
        lng: -73.9656
    }
  
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

    const onLoadWindow = infoWindow => {
        console.log('infoWindow: ', infoWindow)
      }
      

    return isLoaded ? (
        <div>
          <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
            { /* Child components, such as markers, info windows, etc. */ }

            <Marker
              onLoad={onLoad} 
              position={center}
            />
            {/* <InfoWindow
                position={center}
            >
                <div>
                    <h1>InfoWindow</h1>
                </div>
            </InfoWindow> */}
            <Marker
              onLoad={onLoad} 
              position={center2}
            />
            <Marker
                onLoad={onLoad}
                position={center3}
            />
          </GoogleMap>
        </div>
      ) : <div>Map Not Loaded</div>
}

export default MultipleMarkers;