import { Link } from "react-router-dom"

function UserHostedEvent({hosted}){
    return(
        <div>
              <img
          src={hosted.location_image}
          alt={hosted.title}
          className="location-image"
        ></img>
        <p>{hosted.title}</p>
        </div>
    )
}

export default UserHostedEvent