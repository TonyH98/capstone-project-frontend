import "./events.css";
import { Link } from "react-router-dom";


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
const monthName = months.get(numDate?.slice(0, 2));
let eventDate = `${monthName} ${numDate?.slice(3, 5)}, ${numDate?.slice(6)}`;

  console.log(event)
  return (
    <Link to={`/events/${event?.id}`}>
      <div className="w-[600px] h-[200px] flex shadow-2xl bg-white rounded-md my-4">
        <Link to={`/events/${event?.id}`}>
          <img src={event.location_image} className="max-w-[200px] min-h-[200px] rounded-l-md"></img>
        </Link>
        <div className="p-3">
          <Link to={`/events/${event?.id}`}>
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p>Hosted by: {event.creator[0].username}</p>
          </Link>
          <p className="text-cyan-400 text-sm">@{event.address}</p>
          <div className="flex py-2">
          <p className="font-semibold">{eventDate}&nbsp;</p>
          <p className="font-semibold">&nbsp;From &nbsp;{event.start_time}{"-"}</p>
          <p className="font-semibold">{event.end_time}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.category_names.map((category) => {
              return(
                <div key={category.id} className="text-xm bg-cyan-400 py-1 px-2 rounded-full">
                  {category.name}
                </div>
              )
            })}
          </div>
          <p>Summary: {event.summary}</p>
        </div>
      </div>
    </Link>
  );
}
