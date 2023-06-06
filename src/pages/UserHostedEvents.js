import { Link } from "react-router-dom"

function UserHostedEvent({hosted}){
    return(
        <div>
              {/* <img
          src={hosted.location_image}
          alt={hosted.title}
          className="location-image"
          
        ></img> */}
        <Link to={`/events/${hosted.id}`}>
        <p>{hosted.title}</p>

        </Link>
        </div>
    )
}

export default UserHostedEvent