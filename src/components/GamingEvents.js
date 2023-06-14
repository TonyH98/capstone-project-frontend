import { useNavigate } from 'react-router-dom';
import { Marker } from '@react-google-maps/api';

function GamingEvents() {

    const navigate = useNavigate()
    
    return (
        <div>
            <Marker 
                id={7}
                title={'Game Night in LI'}
                position={{lat: 40.87098, lng: -73.42829}}
                onClick={() => navigate(`/events/7`)}

            />
            <Marker 
                id={8}
                title={`Grenwich Village Game Night`}
                position={{lat: 40.729321 , lng: -73.998650}}
                onClick={() => navigate(`/events/8`)}

            />
            <Marker 
                id={9}
                title={`Barcade Beer Night`}
                position={{lat: 40.7120659, lng: -73.9510463}}
                onClick={() => navigate(`/events/9`)}
            />
        </div>
    );
}

export default GamingEvents;