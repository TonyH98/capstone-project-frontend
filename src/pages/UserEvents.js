import {Link} from 'react-router-dom'


function UserEvents({event}){

    return(
        <div>
            <img
          src={event.location_image}
          alt={event.title}
          className="location-image"
        ></img>
        <Link to={`/events/${event.event_id}`}>

        <p>{event.title}: {event.rsvp ? `RSVP` : `Interested`}</p>
        </Link>
        <input
        type="checkbox"
        onChange={(e) => {
            let value = e.target.value
            event.selected = value
            return event
        }}
        />

        </div>
    )
}

export default UserEvents