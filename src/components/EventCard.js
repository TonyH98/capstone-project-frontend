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
const monthName = months.get(numDate?.slice(5, 7));
let eventDate = `${monthName} ${parseInt(numDate?.slice(8))}, ${numDate?.slice(0,4)}`;

  console.log(event)
  return (
    <Link to={`/events/${event?.id}`}>
      <div className="lg:w-[600px] lg:h-[200px] md:w-[680px] sm:w-screen flex shadow-2xl bg-white rounded-md my-4">
        <Link to={`/events/${event?.id}`}>
          <img src={event.location_image} className="w-[200px] h-[200px] rounded-l-md mr-3 object-cover mr-2"></img>
        </Link>
        <div className="p-3 pl-6 w-3/4">
          <Link to={`/events/${event?.id}`}>
            <h2 className="text-lg font-semibold inline">{event.title}</h2>
            <p className="text-cyan-500 text-sm inline ml-2">@{event.location}</p>
          </Link>
          <div className="flex">
            <p className="font-semibold text-[12px] bg-pink-300 px-2 rounded-full py-0.5 border border-pink-300">{eventDate}&nbsp;</p>
            <p className="font-semibold text-[12px] py-1">&nbsp;From &nbsp;{event.start_time}{"-"}</p>
            <p className="font-semibold text-[12px] py-1">{event.end_time}</p>
          </div>
          <p className="text-sm mb-2">Hosted by: {event.creator[0].username}</p>
          <div className="flex flex-wrap gap-2">
            {event.category_names.map((category) => {
              return(
                <div key={category.id} className="text-xs bg-cyan-400 py-1 px-2 my-2 rounded-full">
                  {category.name}
                </div>
              )
            })}
          </div>
          <p className="text-sm"><b>Summary: </b>{event.summary}</p>
        </div>
      </div>
    </Link>
  );
}
