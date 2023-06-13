import { Link } from "react-router-dom"

function UserHostedEvent({hosted}){
    return(
        <div className="h-32 w-28 ml-5">
            <Link to={`/events/${hosted.id}`}>
                <img
                    src={hosted.location_image}
                    alt={hosted.title}
                    className="location-image h-24 w-24 object-cover m-auto"  
                />
                <p className="text-center text-sm truncate py-1">{hosted.title}</p>
            </Link>
        </div>
    )
}

export default UserHostedEvent