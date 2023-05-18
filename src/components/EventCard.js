import "./events.css";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div>
      <Link to={`/events/${event?.id}`}>
      <h2>Title: {event.title}</h2>
      </Link>
      <p>Summary: {event.summary}</p>
     <p>Start Time: {event.start_time}</p>
     <p>End Time: {event.end_time}</p>
    <div className="event-category">
      Categories:{event.category_names.map((category) => {
        return(
          <div key={category.id}>
            {category.name}
          </div>
        )
      })}
    </div>
    </div>
  );
}
