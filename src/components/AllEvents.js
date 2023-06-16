import { useNavigate } from 'react-router-dom';
import { Marker } from '@react-google-maps/api';

function AllEvents() {

    const navigate = useNavigate()

    return (
        <div>
            <Marker 
                id={1}
                title={'Picnic in the Park'}
                position={{lat: 40.77135, lng: -73.97738}}
                onClick={() => navigate(`/events/1`)}
            />
            <Marker 
                id={2}
                title={`Book Club Meeting`}
                position={{lat: 40.75242 , lng: -73.9816} }
                onClick={() => navigate(`/events/2`)}
            />
            <Marker 
                id={3}
                title={`Archery`}
                position={{lat: 40.68251, lng:  -73.98581}}
                onClick={() => navigate(`/events/3`)}
            />
            <Marker 
                id={4}
                title={`Silent Disco`}
                position={{lat: 40.74388, lng: -73.98788}}
                onClick={() => navigate(`/events/4`)}
            />
            <Marker 
                id={5}
                title={`Yoga in the Park`}
                position={{lat: 40.720636 , lng: -73.881855}}
                onClick={() => navigate(`/events/5`)}
            />
            <Marker 
                id={6}
                title={`Hiking Adventure`}
                position={{lat: 41.306796, lng: -74.022446}}
                onClick={() => navigate(`/events/6`)}
            />
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
            <Marker 
                id={10}
                title={`Coney Island Clean Up`}
                position={{lat: 40.574958 , lng: -73.976569}}
                onClick={() => navigate(`/events/10`)}
            />
            <Marker 
                id={11}
                title={`Paint and Sip`}
                position={{lat: 40.66342, lng: -73.96259}}
                onClick={() => navigate(`/events/11`)}
            />
        </div>
    );
}

export default AllEvents;