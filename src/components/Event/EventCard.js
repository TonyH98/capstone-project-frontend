import "./events.css";
import "./EventCard.css"
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function EventCard({ event }) {

// declare a hash map for converting number date to text date with number to text conversions in monthObj
const months = new Map();
const monthObj = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

// sets entries in hash map where each numerical key value points to a text month
for (const key in monthObj) {
  months.set(key, monthObj[key]);
}

// declare variables to construct text date from numerical date
const numDate = event?.date_event;
const monthName = months.get(numDate?.slice(5, 7));
let eventDate = `${monthName} ${parseInt(numDate?.slice(8))}, ${numDate?.slice(0,4)}`;

  return (
    <Link to={`/events/${event?.id}`}>
      <div className="event-card">
        <Link to={`/events/${event?.id}`}>
          <img src={event.location_image} className="event-card-image"></img>
        </Link>
        <div className="event-card-info">
          <Link to={`/events/${event?.id}`}>
            <h2 className="event-card-title">{event.title}</h2>
            <p className="event-card-location">@{event.location}</p>
          </Link>
          <div className="date-category">
            <p className="event-card-date">{eventDate}&nbsp;</p>
            <p className="event-card-start-time">
              &nbsp;&nbsp;{event.start_time.charAt(0) === '0' ? `${event.start_time.slice(1)}` : `${event.start_time}`}{"-"}
            </p>
            <p className="event-card-end-time">
              {event.end_time.charAt(0) === '0' ? `${event.end_time.slice(1)}` : `${event.end_time}`}
            </p>
          </div>
          <div>

          <div className="event-card-category-container">
            {event.category_names.map((category) => {
              return(
                <div key={category.id} className="event-card-category-pill">
                  {category.name}
                </div>
              )
            })}
          </div>
          <p className="event-card-host">Hosted by</p>
          <img 
              src={event?.creator[0].profile_img}
              alt="profile image"
              className="event-card-host-image"
              /> 
          <p className="event-card-host-name">{event?.creator[0].username}</p>
          </div>
          <p className="event-card-summary"><b>Summary: </b>{event.summary.length > 80 ? `${event.summary.substring(0,80)}...` : `${event.summary}`}</p>
          {/* <p className="inline">...</p> */}
        </div>
      </div>
    </Link>
  );
}
