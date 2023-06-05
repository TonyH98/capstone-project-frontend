// DISCUSS whether we want to enforce age min of 18+
// NEED TO ADD Default img, format form, maybe switch to checkboxes for categories

// Create new event form that posts a new event to the events table
import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const { user } = useUser();
  const [ users, setUsers ] = useState({});

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
    <div className="flex justify-center items-center p-4 flex gap-20">
      {
        events?.location_image ? (
          <img 
            src={events?.location_image} 
            alt='event photo' 
            className="max-h-96 max-w-96"
          />
        ) : (
          <div className="bg-gray-200 ">
            <p className="h-96 w-96 text-center pt-[170px]">Preview event image</p>
          </div>
        )
      }
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input 
          type="text" 
          id="title" 
          value={events.title} 
          onChange={handleTextChange} 
          required
        />
        <br />

        <label htmlFor="categoryIds">Categories</label>
        <select 
          id="categoryIds" 
          value={events.categoryIds.length > 0 ? events.categoryIds[0] : ""}
          onChange={handleTextChange} 
          required
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
        <br />
        
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
          <br/>

          <label htmlFor="age_restriction">
            Age Restriction
          </label>
            <select 
              id="age_restriction" 
              value={events.age_restriction}
              onChange={handleTextChange} 
              required
            >
              <option value="">Select Option</option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
            {
              events.age_restriction ? (
                <div>
                  <label htmlFor="age_min">
                    Minimum Age
                  </label>
                  <input 
                    type="number" 
                    id="age_min" 
                    value={events.age_min}
                    onChange={handleTextChange} 
                  />
                  <br />
                  {
                    ageError && <p style={{color:"red"}}>{ageError}</p>
                  }
                  {
                    minAge && <p style={{color:"red"}}>{minAge}</p>
                  }
                  <label htmlFor="age_max">
                    Max Age
                  </label>
                  <input 
                    type="number" 
                    id="age_max" 
                    value={events.age_max}
                    onChange={handleTextChange} 
                  />
                </div>
              ): null
            }
            <br/>
        <br />
        {
          ageError && <p style={{color:"red"}}>{ageError}</p>
        }

        <label htmlFor="location">
          Location
        </label>
        <input 
          type="text" 
          id="location" 
          value={events.location}
          onChange={handleTextChange} 
          required
        />
        <br />

        <label htmlFor="max">
          Max Participants
        </label>
        <input 
          type="number" 
          id="max_people" 
          onChange={handleTextChange} 
          value={events.max_people}
          required
        />
        <br/>
        {
          maxError && <p style={{color:"red"}}>{maxError}</p>
        }

        <label htmlFor="date_event">
          Date
        </label>
        <input 
          type="date" 
          id="date_event" 
          value={events.date_event}
          onChange={handleTextChange} 
          required
        />
        <br/>
        {
          dateError && <p style={{color:"red"}}>{dateError}</p>
        }

        <label htmlFor="start_time">
          Start Time
        </label>
        <input
          type="time" 
          id="start_time" 
          value={events.start_time}
          onChange={handleTextChange} 
          required
        />
        <br/>
        
        <label htmlFor="end_time">
          End Time
        </label>
        <input 
          type="time" 
          id="end_time" 
          value={events.end_time}
          onChange={handleTextChange}
          required
        />
        <br/>
        
        <label htmlFor="address">
          Address
        </label>
        <input 
          type="text" 
          id="address" 
          value={events.address}
          onChange={handleTextChange} 
          required
        />

        <button
          type='button'
          className="underline pl-3"
          onClick={verifyAddress}
        >
          Verify address
        </button>
        <br/>
        
        {
          addressError && <p style={{color:"red"}}>{addressError}</p>
        }

        <label htmlFor="location_image">
          Image
        </label>
        <input 
          type="text" 
          id="location_image" 
          value={events.location_image}
          onChange={handleTextChange} 
        />
        <br/>

        <label htmlFor="summary">
          Summary
        </label>
        <textarea 
          type="text" 
          id="summary" 
          value={events.summary}
          onChange={handleTextChange}
          required
        />
        <br/>

        <input type="submit" />
      </form>
      {
        addressIsVerified ? (
          <GoogleMap 
            mapWidth="300px"
            mapHeight="300px"
            mapLat={coordinates?.latitude}
            mapLng={coordinates?.longitude}
          />
          ) : (
          <div className="">
            <p className="w-[300px] h-[300px] bg-gray-200 text-center pt-[125px] m-auto">
              Please verify a valid address
            </p>
          </div>
        )
      }
    </div>
  );
}