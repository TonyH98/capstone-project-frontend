// Will add an axios call to fetch the information of a specific event
// If the map ends up being its own component we can just import it here
// Will probably add the comment section and the attendees as their own components
// The edit button will link to a prefilled edit page and the cancel button will have a modal window asking to confirm cancellation
// The rsvp button is a placeholder and will be replaced with a dropdown
// I left off any links incase anyone else is working on routes to avoid merge conflicts

// NEED TO add dynamic src for img based on eventInfo object
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import eventPhoto from '../assets/picnic-pic.jpg'

export default function EventDetails() {

  const API = process.env.REACT_APP_API_URL
  const { id } = useParams()
  const [ eventInfo, setEventInfo ] = useState()

  useEffect(() => {
      axios
        .get(`${API}/events/${id}`)
        .then((res) => {
          setEventInfo(res.data)
        })
        .catch((c) => console.warn("catch, c"));
  }, [])

  console.log(eventInfo)
  // console.log(eventInfo.age_max, eventInfo.age_min)

  return (
    <div>
        <div className='flex flex-row'>
          <img 
              src={eventPhoto}
              alt={eventPhoto}
              className='max-h-96 max-w-96 m-12'
          />
          <div className='w-1/2 mt-12'>
              <h1 className='text-3xl'>{eventInfo.title}</h1>
              <h2>Date: {eventInfo.date_event}</h2>
              <h2>Age Restrictions: { eventInfo.age_restriction ? `${eventInfo.age_min} to ${eventInfo.age_max}` : 'None'}</h2>
              <h2>Categories</h2>
              <h2>Summary</h2>
          </div>
          <div className='justify-right m-12'>
              <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                  Show Interest 
              <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
              {/* <!-- Dropdown menu --> */}
              <div id="dropdownHover" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Interested</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">RSVP</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Cancel</a>
                    </li>
                  </ul>
              </div>
          </div>
        </div>
      <div>
        <h2>Attendees(Number)</h2>
      </div>
      <div>
        <h2>Comments</h2>
        <p>Comment section will go here</p>
      </div>
    </div>
  );
}
