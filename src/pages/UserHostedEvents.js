import { Link } from "react-router-dom"

function UserHostedEvent({hosted}){
    return(
        <div className="lg:h-36 lg:w-40 lg:ml-2">
            <Link to={`/events/${hosted.id}`}>
                <img
                    src={hosted.location_image}
                    alt={hosted.title}
                    className="hosted-events-image lg:location-image lg:h-32 lg:w-32 lg:object-cover lg:m-auto mt-2"  
                />
                <p className="hosted-event-title lg:text-center lg:text-sm lg:truncate lg:py-1">{hosted.title}</p>
            </Link>
        </div>
    )
}

export default UserHostedEvent