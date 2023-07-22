import "./events.css";

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
        <div className="lg:w-[600px] lg:h-[200px]  lg:flex lg:shadow-2xl lg:bg-white lg:rounded-md lg:my-4">
          <Link to={`/events/${event?.id}`}>
            <img src={event.location_image} className="lg:w-[200px] lg:h-[200px] lg:rounded-l-md lg:mr-3 lg:object-cover lg:mr-2"></img>
          </Link>
          <div className="lg:p-3 lg:pl-6 lg:w-3/4">
            <Link to={`/events/${event?.id}`}>
              <h2 className="lg:text-lg lg:font-semibold lg:inline">{event.title}</h2>
              <p className="lg:text-cyan-500 lg:text-sm lg:inline lg:ml-2 lg:truncate">@{event.location}</p>
            </Link>
            <div className="lg:flex">
              <p className="lg:font-semibold lg:text-[12px] lg:bg-pink-400 lg:text-white lg:px-2 lg:rounded-full lg:py-0.5 lg:border lg:border-pink-300 lg:text-xs">{eventDate}&nbsp;</p>
              <p className="lg:font-semibold lg:text-[12px] lg:py-1 lg:text-xs">
                &nbsp;&nbsp;{event.start_time.charAt(0) === '0' ? `${event.start_time.slice(1)}` : `${event.start_time}`}{"-"}
              </p>
              <p className="lg:font-semibold lg:text-[12px] lg:py-1 lg:text-xs">
                {event.end_time.charAt(0) === '0' ? `${event.end_time.slice(1)}` : `${event.end_time}`}
              </p>
            </div>
            <div>
  
            <div className="lg:flex lg:flex-wrap lg:gap-1">
              {event.category_names.map((category) => {
                return(
                  <div key={category.id} className="lg:text-xs lg:text-white lg:bg-indigo-500 lg:py-1 lg:px-2 lg:my-1 lg:rounded-full">
                    {category.name}
                  </div>
                )
              })}
            </div>
            <p className="lg:text-xs lg:mb-2 lg:inline">Hosted by</p>
            <img 
                src={event?.creator[0].profile_img}
                alt="profile image"
                className="lg:h-8 lg:w-8 lg:inline lg:rounded-full lg:bg-gray-100 lg:mx-1 lg:my-2 lg:border lg:border-gray-300 lg:hover:border-blue-500 lg:object-cover"
                /> 
            <p class="lg:inline lg:text-xs">{event?.creator[0].username}</p>
            </div>
            <p class="lg:text-sm lg:mt-1 lg:h-10 lg:w-[360px] text-ellipsis overflow-hidden"><b>Summary: </b>{event.summary.length > 80 ? `${event.summary.substring(0,80)}...` : `${event.summary}`}</p>
    
          </div>
        </div>
      </Link>
    );
  }