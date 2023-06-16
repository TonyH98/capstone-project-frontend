import {Link} from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'

function UserEvents({event}){

    return(
        <div className='h-28 w-40 ml-5'>
            <Link to={`/events/${event.event_id}`}>
                <img
                    src={event.location_image}
                    alt={event.title}
                    className="location-image h-24 w-24 object-cover m-auto"
                />
            </Link>
            <div className='m-auto w-32 truncate inline'>
                <input
                    type="checkbox"
                    className='mr-1'
                    onChange={(e) => {
                        let value = e.target.checked
                        event.selected = value
                        return event
                    }}
                />
                <p className='inline truncate text-sm'>
                    <Link>
                        {event.title}
                    </Link>
                    </p>
                    {event.rsvp ? 
                        < AiFillCheckCircle className='inline text-green-500 ml-1'/> 
                        : <AiFillStar className='inline text-yellow-400 ml-1'/>}
            </div>
        </div>
    )
}

export default UserEvents