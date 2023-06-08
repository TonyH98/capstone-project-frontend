// DISCUSS whether we want to enforce age min of 18+
// NEED TO ADD Default img, format form, maybe switch to checkboxes for categories

// Create new event form that posts a new event to the events table
import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Geocode from "react-geocode";
import GoogleMap from "../components/Map";
import { useUser } from "../contexts/UserProvider";

const API = process.env.REACT_APP_API_URL

export default function NewEvent() {

  const navigate = useNavigate();

  // useState to store user ID and categories from axios get request
  const [ category, setCategory ] = useState([])
  const [ coordinates, setCoordinates ] = useState({})
  const [ addressIsVerified, setAddressIsVerified ] = useState(false)
  const [ isValid, setIsValid ] = useState(false)

  // this is to make the form a 2 step
  const [formStep, setFormStep] = useState(0);

  // moves user to the next step of the form
  const nextForm = (e) => {
    e.preventDefault();

    console.log(events);
    console.log("first step", Object.entries(events).slice(0, 7).map(entry => entry[1]));
    let firstStep = Object.entries(events).slice(0, 7).map(entry => entry[1]);
    
    // check if formStep is 0
    if (formStep === 0) {
      // check if any required input is empty
      // const requiredInput = ["events_title", "events_location", "events_address", "events_date_event", "events_start_time", "events_end_time", "events_max_people"];
      const isAnyInputEmpty = firstStep.some((input) => !input);
      
      if (isAnyInputEmpty) {
         // Display an error message or take any necessary action
      alert("Please fill in all required fields.");
      return;
      }
    }
    console.log('events:', events);

    setFormStep((currentStep) => currentStep + 1);
  };

  // moves user to the previous step of the form
  const prevForm = () => {
    setFormStep((currentStep) => currentStep - 1);
  };


  const { user } = useUser();
  const [ users, setUsers ] = useState({});

  // useState to store event information
  const [events, setEvents] = useState({
    title: "",
    location: "",
    address: "",
    date_event: "",
    start_time: "",
    end_time: "",
    max_people: "", // this value sets the max attendees allowed
    summary: "",
    age_restriction: "",
    age_min: 0,
    age_max: 0,
    location_image: "",
    creator: "", 
    categoryIds: []
  });
  
// useState to store error messages
const [ageError, setAgeError] = useState("")
const [minAge , setMinAge] = useState("")
const [maxError , setMaxError] = useState("")
const [dateError, setDateError] = useState("")
const [addressError, setAddressError] = useState("")

// useEffect populates previous event information and adds the creator's user ID
  useEffect(() => {
    if (user?.id) {
      setEvents((prevEvents) => ({
        ...prevEvents,
        creator: user?.id,
      }));
    }
  }, [user?.id]);

// useEffect makes a GET request to store all category options
useEffect(() => {
  axios
  .get(`${API}/category`)
  .then((res) => {
    setCategory(res.data)
  })
  .catch((error) => {
    console.log(error)
  })
}, [])

// function that makes a POST request to add the new event to the events table
const handleAdd = (newEvent) => {
  axios
  .post(`${API}/events` , newEvent)
  .then(() => {
    navigate("/events")
  })
  .catch((error) => {
    console.log(error)
  })
}

// function that updates event information on change in the form
const handleTextChange = (event) => {
  // handles updating the category IDs allowing up to three unique choices for categories
  if (event.target.id === "categoryIds") {
    const { value } = event.target;

    if (!events.categoryIds.includes(value) && events.categoryIds.length < 3 && value) {
      setEvents((prevEvent) => ({
        ...prevEvent,
        categoryIds: [...prevEvent.categoryIds, value],
      }));
    }
  } 
  // handles updates to min age, max age and max number of people and converts the value to a number if there is an input
  else if (event.target.id === "age_min" || event.target.id === "age_max" || event.target.id === "max_people") {
    const { id, value } = event.target;
    setEvents((prevEvent) => ({
      ...prevEvent,
      [id]: value ? Number(value) : "", // Convert to number if value exists, otherwise set it as an empty string
    }));
  }
  else if (event.target.id === "age_restriction") {
    const { value } = event.target;
    const isAgeRestricted = value === "true"; 
    setEvents((prevEvent) => ({
      ...prevEvent,
      age_restriction: isAgeRestricted,
    }));
  }
  // handles updating all other fields of the event details
  else {
    const { id, value } = event.target;
    setEvents((prevEvent) => ({
      ...prevEvent,
      [id]: value,
    }));
  }
  console.log(events.date_event)
};

// function handles removing a category that was selected on button click and updates the event details object
const filterCategory = (category) => {
  const filter = events.categoryIds.filter((ele) => {
    return ele !== category
  })

  setEvents({...events, categoryIds: filter})
}

// function validates that the the max age is greater than or equal to the min age
function checkAge(){
  if(events.age_restriction){
    if(events.age_max >= events.age_min){
        return true
      } else {
        return false
      }
  } else {
    return true
  }
}

// function validates that the min age is greater than or equal to 18
function checkMinAge(){
  if(events.age_restriction){
    if(events.age_min >= 18){
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

// function validates that a max number of people is input
function checkMax(){
  if(events.max_people > 0){
    return true
  } else {
    return false
  }
}

// function validates that the event date is not a date in the past
function checkDate() {
  console.log(events.date_event)
  const eventDate = new Date(events.date_event);
  const currentDate = new Date();

  // Set the time component of both dates to midnight
  eventDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  if (eventDate >= currentDate) {
    return true;
  } else {
    return false;
  }
}

// function that uses geocode API to verify and convert address to latitude and longitude for Google Maps rendering
  const verifyAddress = () => {
  // resets useState hooks to re-verify on click or on submit
  setAddressError('')   
  setAddressIsVerified(false)

  // set Google Maps Geocoding API for purposes of quota management
  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  
  // Get latitude & longitude from address.
  Geocode.fromAddress(events.address).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setCoordinates({
        latitude: lat,
        longitude: lng
      })
      setEvents({...events, latitude:lat, longitude:lng})
      setAddressIsVerified(true)
    },
    (error) => {
      console.error(error);
      setAddressError("Invalid address")
      setAddressIsVerified(false)
      setCoordinates({})
    }
  );
    console.log('addressIsVerified', addressIsVerified)
}

// useEffect to run verify address on address field change
// useEffect(() => {
//   verifyAddress()
// }, [events.address])

// submit function checks if all input fields are valid and posts event to the events table
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("first step", Object.entries(events).slice(-8).map(entry => entry[1]));
    let secondStep = Object.entries(events).slice(-8).map(entry => entry[1]);
    
    // check if formStep is 0
    if (formStep === 0) {
      // check if any required input is empty
      // const requiredInput = ["events_title", "events_location", "events_address", "events_date_event", "events_start_time", "events_end_time", "events_max_people"];
      const isAnyInputEmpty = secondStep.some((input) => !input);
      
      if (isAnyInputEmpty) {
         // Display an error message or take any necessary action
      alert("Please fill in all required fields.");
      return;
      }
    }
    console.log('events:', events);

    // resets useState for error messages to re-test if valid
    setAddressError('')
    setAgeError('')
    setMinAge('')
    setMaxError('')
    setDateError('')

    let isValid = true

    verifyAddress()

    if(!addressIsVerified){
      // setAddressError('Invalid address')
      isValid = false
    }
    if(!checkAge()){
      setAgeError("The max age needs to be greater than the minimum age")
      isValid = false
    }
    if(!checkMinAge()){
      setMinAge("The minimum age needs to be at least 18")
      isValid = false
    }
    if(!checkMax()){
      setMaxError("The max people needs to be greater than 0")
      isValid = false
    }
    if(!checkDate()){
      setDateError("The date of the event needs to be later than the current date")
      isValid = false
    }
   
    if(isValid){
      handleAdd(events)
      console.log("Submit went through")
    } else {
      console.log("Submit was blocked")
    }
  }
  console.log(events)
  
  return (
    <div className="lg:flex items-center justify-center p-4 lg:gap-20 md:gap-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md px-10 pt-6 pb-8 mb-4 md:w-2/3 lg:w-2/5 mx-auto">
        { formStep === 0 && (
          <section className="">
            <div className="mb-3">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-1">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title"
            value={events.title} 
            onChange={handleTextChange} 
            required
            className="shadow bg-transparent appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <input 
            type="text" 
            id="location" 
            name="location"
            value={events.location}
            onChange={handleTextChange} 
            required
            className="shadow bg-transparent appearance-none border w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
            Address
          </label>
          <input 
            type="text" 
            id="address" 
            name="address"
            value={events.address}
            onChange={handleTextChange} 
            required
            className="shadow bg-transparent appearance-none border w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
          />
          <button
            type='button'
            className="underline block mt-2 text-purple-500 text-sm"
            onClick={verifyAddress}
          >
            Verify address
          </button>
          {
            addressError && <p style={{color:"red"}}>{addressError}</p>
          }
        </div>
        <div className="sm:flex justify-between gap-2">
          <div className="mb-3">
            <label htmlFor="date_event" className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input 
              type="date" 
              id="date_event" 
              name="date_event"
              value={events.date_event}
              onChange={handleTextChange} 
              required
              className="shadow bg-transparent appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
            />
          </div>
        {
          dateError && <p style={{color:"red"}}>{dateError}</p>
        }
        <div className="flex gap-2">
          <div className="mb-3">
            <label htmlFor="start_time" className="block text-gray-700 text-sm font-bold mb-2">
              Start Time
            </label>
            <input
              type="time" 
              id="start_time" 
              name="start_time"
              value={events.start_time}
              onChange={handleTextChange} 
              required
              className="shadow bg-transparent appearance-none border  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
            />
         </div>
          <div className="mb-3">
            <label htmlFor="end_time" className="block text-gray-700 text-sm font-bold mb-2">
              End Time
            </label>
            <input 
            type="time" 
            id="end_time" 
            name="end_time"
            value={events.end_time}
            onChange={handleTextChange}
            required
            className="shadow bg-transparent appearance-none border  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
            />
          </div>
        </div>
        </div>
        <div className="mb-3">
            <label htmlFor="max" className="block text-gray-700 text-sm font-bold mb-2">
              Max Participants
            </label>
            <input 
              type="number" 
              id="max_people" 
              name="max_people"
              onChange={handleTextChange} 
              value={events.max_people}
              required
              className="shadow bg-transparent appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
            />
          </div>
          {
            maxError && <p style={{color:"red"}}>{maxError}</p>
          }
        <div className="flex justify-evenly pt-4">
        {formStep < 1 ? <button onClick={nextForm} className="block border border-cyan-400 bg-cyan-400 hover:bg-purple-400
        hover:border-purple-400 text-slace-900 hover:text-slate-100 uppercase text-sm font-bold py-2 px-4 rounded-md">Next</button> : ""}
        <Link to={`/events`}>
            <button className="block border border-gray-500 hover:bg-[#f6854b] hover:border-[#f6854b] text-slace-900 hover:text-slate-100 uppercase text-sm font-bold p-2 rounded-md">
              Cancel
            </button>
          </Link>
        </div>
          </section>
        )}
        { formStep === 1 && (
          <section className="w-[450px] py-6">
        <div className="mb-3 sm:flex">
          <div className="mr-2">
            <label htmlFor="categoryIds" className="block text-gray-700 text-sm font-bold mb-1">Categories</label>
            <select 
              id="categoryIds" 
              value={events.categoryIds.length > 0 ? events.categoryIds[0] : ""}
              onChange={handleTextChange} 
              required
              className="shadow bg-transparent appearance-none border md:w-full py-2 pl-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
            >
            <option value="">
              Select a category
            </option>
            {
              category.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))
            }
          </select>
          </div>
          {
          events.categoryIds.length > 0 ? (
              <div className="category-container">
                {
                  events.categoryIds.map((category) => {
                    return(
                      <div className="category-pills" key={category.name}>
                        {category}
                        <button 
                          onClick={() =>filterCategory(category)}
                          className="pl-2 text-red-500 text-xl"
                        >
                          x
                        </button>
                      </div>
                    )
                  })
                }
              </div>
            ) : null
          }
        </div>
        <div className="mb-3 flex">
          <div>
          <label htmlFor="age_restriction" className="block text-gray-700 text-sm font-bold mb-2">
            Age Restriction
          </label>
            <select 
              id="age_restriction" 
              value={events.age_restriction}
              onChange={handleTextChange} 
              required
              className="shadow bg-transparent appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
            >
              <option value="">Select Option</option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </div>
            {
              events.age_restriction ? (
                <div className="flex">
                  <div className="">
                  <label htmlFor="age_min" className="block text-gray-700 text-sm font-bold mb-2">
                    Min Age
                  </label>
                  <input 
                    type="number" 
                    id="age_min" 
                    value={events.age_min}
                    onChange={handleTextChange} 
                    className="shadow bg-transparent appearance-none border py-2 px-3 mx-2 w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                  />
                  </div>
                  {
                    ageError && <p style={{color:"red"}}>{ageError}</p>
                  }
                  {
                    minAge && <p style={{color:"red"}}>{minAge}</p>
                  }
                  <div>
                  <label htmlFor="age_max" className="block text-gray-700 text-sm font-bold mb-2">
                    Max Age
                  </label>
                  <input 
                    type="number" 
                    id="age_max" 
                    value={events.age_max}
                    onChange={handleTextChange} 
                    className="shadow bg-transparent appearance-none border py-2 px-3 mx-2 w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                  />
                  </div>
                </div>
              ): null
            }
          </div>
        {
          ageError && <p style={{color:"red"}}>{ageError}</p>
        }
        
        <div className="mb-3">
          <label htmlFor="location_image" className="block text-gray-700 text-sm font-bold mb-2">
            Image
          </label>
          <input 
            type="text" 
            id="location_image" 
            value={events.location_image}
            onChange={handleTextChange} 
            className="shadow bg-transparent appearance-none border md:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="summary" className="block text-gray-700 text-sm font-bold mb-2">
            Summary
          </label>
          <textarea 
            type="text" 
            id="summary" 
            value={events.summary}
            onChange={handleTextChange}
            required
            className="shadow bg-transparent appearance-none border md:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
          />
        </div>
        <div className="flex sm:justify-evenly gap-2 font-semibold">
        {formStep > 0 ? <button onClick={prevForm} className="block border border-gray-500 hover:bg-cyan-400 hover:border-cyan-400 text-slace-900 hover:text-slate-100 uppercase text-sm font-bold p-2 rounded-md">previous</button> : ""}
          <input type="submit" className="bg-cyan-400 hover:bg-purple-500 text-slate-100 uppercase text-sm font-bold py-2 px-4 rounded-md" />
          <Link to={`/events`}>
            <button className="block border border-gray-500 hover:bg-[#f6854b] hover:border-[#f6854b] text-slace-900 hover:text-slate-100 uppercase text-sm font-bold p-2 rounded-md">
              Cancel
            </button>
          </Link>
        </div>
          </section>
        )}
      </form>
      { formStep === 0 && (
        <> {
        (!addressError && !!events?.address) ? (
          <GoogleMap 
            mapWidth="300px"
            mapHeight="300px"
            mapLat={coordinates?.latitude}
            mapLng={coordinates?.longitude}
          />
        ) : (
          <div className="sm:w-[300px] h-[300px] mx-auto flex items-center justify-center">
            <p className="w-[300px] h-[300px] bg-gray-200 text-center pt-[125px] m-auto">
              Please verify a valid address
            </p>
          </div>
        )}
        </>
      )
      }
      { formStep === 1 && (
        <>
        {
        events?.location_image ? (
          <img 
            src={events?.location_image} 
            alt='event photo' 
            className="max-h-[300px] max-w-[300px]"
          />
        ) : (
          <div className="bg-gray-200 sm:w-[300px] h-[300px] flex justify-center items-center mx-auto">
            <p className="sm:w-96 text-center">Preview event image</p>
          </div>
        )
      }
        </>
      )}
    </div>
  );
}