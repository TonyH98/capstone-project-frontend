// DISCUSS whether we want to enforce age min of 18+
// NEED TO ADD Default img, format form, maybe switch to checkboxes for categories

// Create new event form that posts a new event to the events table
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NewEvent.css"
import Geocode from "react-geocode";
import GoogleMap from "../../components/Map"

const API = process.env.REACT_APP_API_URL

export default function NewEvent({users}) {
  const navigate = useNavigate();

  // useState to store user ID and categories from axios get request
  const [ category, setCategory ] = useState([])
  const [ coordinates, setCoordinates ] = useState({})
  const [ addressIsVerified, setAddressIsVerified ] = useState(false)
  const [ isValid, setIsValid ] = useState(true)

  // this is to make the form a 2 step
  const [formStep, setFormStep] = useState(0);

  // moves user to the next step of the form
  const nextForm = (e) => {
    e.preventDefault();
    
    // for date
    setDateError('')
    setTimeError('')
    setMaxError('')
    setAddressError('')


    console.log(events);
    console.log("first step", Object.entries(events).slice(0, 7).map(entry => entry[1]));
    let firstStep = Object.entries(events).slice(0, 7).map(entry => entry[1]);
    
    // check if formStep is 0
    if (formStep === 0) {
      // check if any required input is empty
      // const requiredInput = ["events_title", "events_location", "events_address", "events_date_event", "events_start_time", "events_end_time", "events_max_people"];
      const isAnyInputEmpty = firstStep.some((input) => !input);
      
      // if (isAnyInputEmpty) {
         // Display an error message or take any necessary action
      // alert("Please fill in all required fields.");
      // return;
      // }
    } 

    verifyAddress()

    if(!addressIsVerified){
      // setAddressError('Invalid address')
      setIsValid(false);
    } 
     if(!checkDate()){
      setDateError("*The date of the event needs to be later than the current date")
      setIsValid(false);
    } 
     if (!checkTime()) {
      setTimeError("*End time cannot be earlier than or equal to the start time.");
      setIsValid(false);
    } 
     if(!checkMax()){
      setMaxError("*Maximum number of participants must be greater than 0")
      setIsValid(false);
    } 
    if (checkDate() && checkTime() && checkMax()) { 
      setFormStep((currentStep) => currentStep + 1);
    }
    console.log('events:', events);
  };

  // moves user to the previous step of the form
  const prevForm = () => {
    setFormStep((currentStep) => currentStep - 1);
  };

  // useState to store event information
  const [events, setEvents] = useState({
    title: "",
    date_event: "",
    summary: "",
    max_people: "", // this value sets the max attendees allowed
    age_restriction: "",
    age_min: 0,
    age_max: 0,
    location_name: "",
    address: "",
    start_time: "",
    end_time: "",
    location_image: "",
    creator: users?.id,
    categoryIds: [],
  });
  
// useState to store error messages
const [ageError, setAgeError] = useState("")
const [minAge , setMinAge] = useState("")
const [maxError , setMaxError] = useState("")
const [dateError, setDateError] = useState("")
const [addressError, setAddressError] = useState("")

const [timeError, setTimeError] = useState("")


// useEffect populates previous event information and adds the creator's user ID
  useEffect(() => {
    if (users?.id) {
      setEvents((prevEvents) => ({
        ...prevEvents,
        creator: users?.id,
      }));
    }
  }, [users?.id]);

  // useEffect makes a GET request to store all category options
  useEffect(() => {
    axios
      .get(`${API}/category`)
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(users)
  // function that makes a POST request to add the new event to the events table
  const handleAdd = (newEvent) => {
    axios
      .post(`${API}/events`, newEvent)
      .then(() => {
        navigate("/events");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // function that updates event information on change in the form
  const handleTextChange = (event) => {
    // handles updating the category IDs allowing up to three unique choices for categories
    if (event.target.id === "categoryIds") {
      const { value } = event.target;

      if (
        !events.categoryIds.includes(value) &&
        events.categoryIds.length < 3 &&
        value
      ) {
        setEvents((prevEvent) => ({
          ...prevEvent,
          categoryIds: [...prevEvent.categoryIds, value],
        }));
      }
    }
    // handles updates to min age, max age and max number of people and converts the value to a number if there is an input
    else if (
      event.target.id === "age_min" ||
      event.target.id === "age_max" ||
      event.target.id === "max_people"
    ) {
      const { id, value } = event.target;
      setEvents((prevEvent) => ({
        ...prevEvent,
        [id]: value ? Number(value) : "", // Convert to number if value exists, otherwise set it as an empty string
      }));
    } else if (event.target.id === "age_restriction") {
      const { value } = event.target;
      const isAgeRestricted = value === "true";
      setEvents((prevEvent) => ({
        ...prevEvent,
        age_restriction: isAgeRestricted,
      }));
    }
    else if (event.target.id === "summary"){
      const {value} = event.target
      if(value.length <=250){
        setEvents((prevEvent) => ({
          ...prevEvent,
          summary: value,
        }));
      } 
      else{
        event.target.value = value.substr(0,250)
      }
    }
    // handles updating all other fields of the event details
    else {
      const { id, value } = event.target;
      setEvents((prevEvent) => ({
        ...prevEvent,
        [id]: value,
      }));
    }
    console.log(events.date_event);
  };

  // function handles removing a category that was selected on button click and updates the event details object
  const filterCategory = (category) => {
    const filter = events.categoryIds.filter((ele) => {
      return ele !== category;
    });

    setEvents({ ...events, categoryIds: filter });
  };

  // function validates that the the max age is greater than or equal to the min age
  function checkAge() {
    if (events.age_restriction) {
      if (events.age_max >= events.age_min) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  // function validates that the min age is greater than or equal to 18
  function checkMinAge() {
    if (events.age_restriction) {
      if (events.age_min >= 18) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

// function validates that a max number of people is input
function checkMax(){
  const maxParticipantsValue = parseInt(events.max_people, 10);
  if(maxParticipantsValue <= 0){
    return false
  } else {
    return true
  }
}

  // function validates that the event date is not a date in the past
  function checkDate() {
    console.log(events.date_event);
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

// function validates that the ending time is not earlier than the starting time
function checkTime() {

  console.log("event start time:", events.start_time);
  console.log("event end time:", events.end_time);

   // Extract the time component from the start and end time strings
   const start = events.start_time.split(":").join("");
   const end = events.end_time.split(":").join("");

  console.log("start:", start);
  console.log("end:", end);
 

  if (end <= start) {
    return false;
  } else {
    return true;
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
      setAddressError("*Invalid address")
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

    // resets useState for error messages to re-test if valid
    setAddressError('')
    setAgeError('')
    setMinAge('')
    setMaxError('')

    setIsValid(true)

    // let isValid = true

    // verifyAddress()

    // if(!addressIsVerified){
    //   // setAddressError('Invalid address')
    //   isValid = false
    // }
    if(!checkAge()){
      setAgeError("The max age needs to be greater than the minimum age")
      setIsValid(false)
    }
    if (!checkMinAge()) {
      setMinAge("The minimum age needs to be at least 18");
      setIsValid(false)
    }
    // if(!checkMax()){
    //   setMaxError("The max people needs to be greater than 0")
    //   isValid = false
    // }
    // if(!checkDate()){
    //   setDateError("The date of the event needs to be later than the current date")
    //   isValid = false
    // }
   
    if(isValid){
      handleAdd(events)
      console.log("Submit went through")
    } else {
      console.log("Submit was blocked");
    }
  };
  
  console.log(events)

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        className="new-event-form"
      >
        {formStep === 0 && (
          <section className="">
            <div className="mb-3">
          <label htmlFor="title" className="title-label">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title"
            value={events.title} 
            onChange={handleTextChange} 
            required
            className="title-input-box"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="location" className="location=label">
            Location
          </label>
          <input 
            type="text" 
            id="location" 
            name="location"
            value={events.location}
            onChange={handleTextChange} 
            required
            className="location-input-box"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="address-label">
            Address
          </label>
          <input 
            type="text" 
            id="address" 
            name="address"
            value={events.address}
            onChange={handleTextChange} 
            required
            className={`${addressError ? "address-error" : "address-valid"} address-input-box`}
          />
          <button
            type='button'
            className="test-address-button"
            onClick={verifyAddress}
          >
            Verify address
          </button>
        </div>
        <div className="sm:flex justify-between gap-2">
          <div className="mb-3">
            <label htmlFor="date_event" className="new-event-date">
              Date
            </label>
            <input 
              type="date" 
              id="date_event" 
              name="date_event"
              value={events.date_event}
              onChange={handleTextChange} 
              required
              className={`${dateError ? "dateError" : "validDate"} date-input-box`}
            />
          </div>
        <div className="flex gap-2">
          <div className="mb-3">
            <label htmlFor="start_time" className="start-time-label">
              Start Time
            </label>
            <input
              type="time" 
              id="start_time" 
              name="start_time"
              value={events.start_time}
              onChange={handleTextChange} 
              required
              className={`${timeError ? "timeError" : "timeValid"} start-time-input-box`}
            />
         </div>
          <div className="mb-3">
            <label htmlFor="end_time" className="end-time-label">
              End Time
            </label>
            <input 
            type="time" 
            id="end_time" 
            name="end_time"
            value={events.end_time}
            onChange={handleTextChange}
            required
            className={`${timeError ? "timeError" : "timeValid"} end-time-input-box`}
            />
          </div>
        </div>
        </div>
        <div className="mb-3">
            <label htmlFor="max" className="max-label">
              Max Participants
            </label>
            <input 
              type="number" 
              id="max_people" 
              name="max_people"
              onChange={handleTextChange} 
              value={events.max_people}
              required
              className={`${maxError ? "maxError" : "maxValid"} max-input-box`}
              />
          </div>
          <div>
            {
              addressError && <p style={{color:"red"}} className="text-xs">{addressError}</p>
            }
            {
              dateError && <p style={{color:"red"}} className="text-xs">{dateError}</p>
            }
            {
              timeError && <p style={{color:"red"}} className="text-xs">{timeError}</p>
            }
            {
              maxError && <p style={{color:"red"}} className="text-xs">{maxError}</p>
            }
          </div>
        <div className="flex justify-evenly pt-4">
        {formStep < 1 ? <button onClick={nextForm} className="first-page-next">Next</button> : ""}
        <Link to={`/events`}>
            <button className="first-page-cancel-button">
              Cancel
            </button>
          </Link>
        </div>
          </section>
        )}
        {formStep === 1 && (
          <section className="w-[450px] py-6">
            <div className="mb-3 sm:flex">
              <div className="mr-2">
                <label
                  htmlFor="categoryIds"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Categories
                </label>
                <select
                  id="categoryIds"
                  value={
                    events.categoryIds.length > 0 ? events.categoryIds[0] : ""
                  }
                  onChange={handleTextChange}
                  required
                  className="shadow bg-transparent appearance-none border border-black sm:w-full py-2 pl-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                >
                  <option value="">Select a category</option>
                  {category.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {events.categoryIds.length > 0 ? (
                <div className="category-container">
                  {events.categoryIds.map((category) => {
                    return (
                      <div className="category-pills" key={category.name}>
                        {category}
                        <button
                          onClick={() => filterCategory(category)}
                          className="pl-2 text-red-500 text-xl"
                        >
                          x
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="mb-3 sm:flex">
              <div>
                <label
                  htmlFor="age_restriction"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Age Restriction
                </label>
                <select
                  id="age_restriction"
                  value={events.age_restriction}
                  onChange={handleTextChange}
                  required
                  className="shadow bg-transparent appearance-none border border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                >
                  <option value="">Select Option</option>
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>
              {events.age_restriction ? (
                <div className="sm:flex">
                  <div className="">
                    <label
                      htmlFor="age_min"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Min Age
                    </label>
                    <input
                      type="number"
                      id="age_min"
                      value={events.age_min}
                      onChange={handleTextChange}
                      className="shadow bg-transparent appearance-none border border-black py-2 px-3 sm:mx-2 sm:w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                    />
                  </div>
                  {ageError && <p style={{ color: "red" }}>{ageError}</p>}
                  {minAge && <p style={{ color: "red" }}>{minAge}</p>}
                  <div>
                    <label
                      htmlFor="age_max"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Max Age
                    </label>
                    <input
                      type="number"
                      id="age_max"
                      value={events.age_max}
                      onChange={handleTextChange}
                      className="shadow bg-transparent appearance-none border border-black py-2 px-3 sm:mx-2 sm:w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            {ageError && <p style={{ color: "red" }}>{ageError}</p>}

            <div className="mb-3">
              <label
                htmlFor="location_image"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Image
              </label>
              <input
                type="text"
                id="location_image"
                value={events.location_image}
                onChange={handleTextChange}
                className="shadow bg-transparent border-black appearance-none border sm:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="summary"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Summary
              </label>
              <textarea
                type="text"
                id="summary"
                value={events.summary}
                onChange={handleTextChange}
                required
                className="shadow bg-transparent border-black appearance-none border sm:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md"
              />
               <p className={`${events?.summary.length >= 250 ? 'text-red-700' : null}  bottom-5 left-3 text-sm`}>
                        {events?.summary.length}/250 characters
                    </p>
            </div>
            <div className="flex sm:justify-evenly gap-2 font-semibold">
              {formStep > 0 ? (
                <button
                  onClick={prevForm}
                  className="block border border-gray-500 hover:bg-cyan-400 hover:border-cyan-400 text-slace-900 hover:text-slate-100 uppercase text-sm font-bold p-2 rounded-md"
                >
                  previous
                </button>
              ) : (
                ""
              )}
              <input
                type="submit"
                className="bg-cyan-400 hover:bg-purple-500 text-slate-100 uppercase text-sm font-bold py-2 px-4 rounded-md"
              />
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
        <div className="flex items-center justify-center m-auto"> {
        (!addressError && !!events?.address) ? (
          <GoogleMap 
            mapWidth="300px"
            mapHeight="300px"
            mapLat={coordinates?.latitude}
            mapLng={coordinates?.longitude}
          />
        ) : (
          <div className="sm:w-[300px] h-[300px] flex items-center justify-center m-auto">
            <p className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">
              Please verify a valid address
            </p>
          </div>
        )}
        </div>
      )
      }
      { formStep === 1 && (
        <div className="flex items-center justify-center m-auto">
        {
        events?.location_image ? (
          <img 
            src={events?.location_image} 
            alt='event photo' 
            className="max-h-[300px] max-w-[300px]"
          />
        ) : (
          <div className="bg-gray-200 sm:w-[300px] h-[300px] flex justify-center items-center mx-auto">
            <p className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">Preview event image</p>
          </div>
        )
      }
        </div>
      )}
</div>
)
}
