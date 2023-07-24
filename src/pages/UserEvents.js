import {Link} from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'

function UserEvents({event, editEvents}){

    return(
        <div className='lg:h-36 lg:w-40 lg:ml-4'>
            <Link to={`/events/${event.event_id}`}>
                <img
                    src={event.location_image}
                    alt={event.title}
                    className="profile-event-image lg:location-image lg:h-32 lg:w-32 lg:object-cover lg:m-auto lg:mt-2"
                />
            </Link>
            <div className='lg:w-32 lg:truncate lg:inline lg:ml-4'>
                <input
                    type="checkbox"
                    className={`lg:mr-1 lg:alsolute ${editEvents ? 'visible' : 'hidden'}`}
                    onChange={(e) => {
                        let value = e.target.checked
                        event.selected = value
                        return event
                    }}
                />
                <p className='lg:inline lg:truncate lg:text-sm'>
                    <Link>
                        {event.title.length > 16 ? `${event.title.slice(0,16)}...` : `${event.title}` }
                    </Link>
                    </p>
                    {event.rsvp ? 
                        < AiFillCheckCircle className='lg:inline lg:text-green-500 lg:ml-1'/> 
                        : <AiFillStar className='lg:inline lg:text-yellow-400 lg:ml-1'/>}
            </div>
        </div>
    )
}

export default UserEvents