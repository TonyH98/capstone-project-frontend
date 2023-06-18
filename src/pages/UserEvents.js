import {Link} from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'

function UserEvents({event, editEvents}){

    return(
        <div className='h-36 w-40 ml-4'>
            <Link to={`/events/${event.event_id}`}>
                <img
                    src={event.location_image}
                    alt={event.title}
                    className="location-image h-32 w-32 object-cover m-auto mt-2"
                />
            </Link>
            <div className='w-32 truncate inline ml-4'>
                <input
                    type="checkbox"
                    className={`mr-1 alsolute ${editEvents ? 'visible' : 'hidden'}`}
                    onChange={(e) => {
                        let value = e.target.checked
                        event.selected = value
                        return event
                    }}
                />
                <p className='inline truncate text-sm'>
                    <Link>
                        {event.title.length > 16 ? `${event.title.slice(0,16)}...` : `${event.title}` }
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