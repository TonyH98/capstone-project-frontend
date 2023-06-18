import { Link } from "react-router-dom"

function UserHostedEvent({hosted}){
    return(
        <div className="h-36 w-40 ml-2">
            <Link to={`/events/${hosted.id}`}>
                <img
                    src={hosted.location_image}
                    alt={hosted.title}
                    className="location-image h-32 w-32 object-cover m-auto mt-2"  
                />
                <p className="text-center text-sm truncate py-1">{hosted.title}</p>
            </Link>
        </div>
    )
}

export default UserHostedEvent