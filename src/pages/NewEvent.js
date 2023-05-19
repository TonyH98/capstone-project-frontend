// DISCUSS whether we want to enforce age min of 18+

// Create new event form that posts a new event to the events table
import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL

export default function NewEvent() {

  let navigate = useNavigate();

  // useState to store user ID and categories from axios get request
  let [ users, setUsers ] = useState({})
  let [ category, setCategory ] = useState([])

  // useState to store event information
  const [events, setEvent] = useState({
    title: "",
    date_event: "",
    summary: "",
    max_people: "", // this value sets the max attendees allowed
    age_restriction: "",
    age_min: 0,
    age_max: 0,
    location_name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    start_time: "",
    end_time: "",
    location_image: "",
    creator: "", 
    categoryIds: []
  });
  
console.log(events)

// useState to store error messages
let [ageError, setAgeError] = useState("")
let [minAge , setMinAge] = useState("")
let [maxError , setMaxError] = useState("")
let [dateError, setDateError] = useState("")

// useEffect makes an axios GET request to get the creator's user ID
useEffect(() => {
  axios
  .get(`${API}/users/johndoe`)
  .then((res) => {
    setUsers(res.data)
  })
  }, [users.id])

// useEffect populates previous event information and adds the creator's user ID
  useEffect(() => {
    if (users.id) {
      setEvent((prevEvents) => ({
        ...prevEvents,
        creator: users.id,
      }));
    }
  }, [users.id]);

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
      setEvent((prevEvent) => ({
        ...prevEvent,
        categoryIds: [...prevEvent.categoryIds, value],
      }));
    }
  } 
  // handles updates to min age, max age and max number of people and converts the value to a number if there is an input
  else if (event.target.id === "age_min" || event.target.id === "age_max" || event.target.id === "max_people") {
    const { id, value } = event.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [id]: value ? Number(value) : "", // Convert to number if value exists, otherwise set it as an empty string
    }));
  }

  else if (event.target.id === "age_restriction") {
    const { value } = event.target;
    const isAgeRestricted = value === "true"; 
    setEvent((prevEvent) => ({
      ...prevEvent,
      age_restriction: isAgeRestricted,
    }));
  }
  // handles updating all other fields of the event details
  else {
    const { id, value } = event.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [id]: value,
    }));
  }
};

// function handles removing a category that was selected on button click and updates the event details object
const filterCategory = (category) => {
  const filter = events.categoryIds.filter((ele) => {
    return ele !== category
  })

  setEvent({...events, categoryIds: filter})
}

// function validates that the the max age is greater than or equal to the min age
function checkAge(){
  if(events.age_restriction){
    if(events.age_max >= events.age_min){
        return true
      } else {
        return false
      }

  }
  else{
    return true
  }
}

// function validates that the min age is greater than or equal to 18
function checkMinAge(){
  if(events.age_restriction){
    if(events.age_min >= 18){
      return true
    }
    else{
      return false
    }
  }
  else{
    return true
  }
}

// function validates that a max number of people is input
function checkMax(){
  if(events.max_people > 0){
    return true
  }
  else{
    return false
  }
}

// function validates that the event date is not a date in the past
function checkDate() {
  const eventDate = new Date(events.date_event);
  const currentDate = new Date();

  if (eventDate > currentDate) {
    return true;
  } else {
    return false;
  }
}

// submit function checks if all input fields are valid and posts event to the events table
  function handleSubmit(event) {
    event.preventDefault();

    let isValid = true

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
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" onChange={handleTextChange} value={events.title}/>
        <br />

        <label htmlFor="categoryIds">Categories</label>
        <select id="categoryIds" onChange={handleTextChange} value={events.categoryIds.length > 0 ? events.categoryIds[0] : ""}>
          <option value="">Select a category</option>
          {category.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        <br />
        
        {events.categoryIds.length > 0 ? (
          <div className="category-container">
            {events.categoryIds.map((category) => {
              return(
                <div className="category-pills">
                  {category}  <button onClick={() =>filterCategory(category)}>X</button>
                </div>
              )
            })}
          </div>
        ) : null}
          <br/>
          <label htmlFor="age_restriction">Age Restriction</label>
            <select id="age_restriction" onChange={handleTextChange} value={events.age_restriction}>
              <option value="">Select Option</option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
            {events.age_restriction ? (
              <div>
                <label htmlFor="age_min">Minimum Age</label>
                <input type="number" id="age_min" onChange={handleTextChange} value={events.age_min}/>
                <br />
                {ageError && <p style={{color:"red"}}>{ageError}</p>}
                {minAge && <p style={{color:"red"}}>{minAge}</p>}
                <label htmlFor="age_max">Max Age</label>
                <input type="number" id="age_max" onChange={handleTextChange} value={events.age_max}/>
              </div>
            ): null}
            <br/>
        <br />
        {ageError && <p style={{color:"red"}}>{ageError}</p>}
        <label htmlFor="location">Location</label>
        <input type="text" id="location" onChange={handleTextChange} value={events.location}/>
        <br />

        <label htmlFor="max">Max Participants</label>
        <input type="number" id="max_people" onChange={handleTextChange} value={events.max_people}/>
        <br />
        {maxError && <p style={{color:"red"}}>{maxError}</p>}
        <label htmlFor="date_event">Date</label>
        <input type="date" id="date_event" onChange={handleTextChange} value={events.date_event}/>
        <br />
        {dateError && <p style={{color:"red"}}>{dateError}</p>}
        <label htmlFor="start_time">Start Time</label>
        <input type="time" id="start_time" onChange={handleTextChange} value={events.start_time}/>
        <br />
        
        <label htmlFor="end_time">End Time</label>
        <input type="time" id="end_time" onChange={handleTextChange} value={events.end_time}/>
        <br />
        
        <label htmlFor="address">Address</label>
        <input type="text" id="address" onChange={handleTextChange} value={events.address}/>
            <br></br>
        <label htmlFor="location_image">Image</label>
        <input type="text" id="location_image" onChange={handleTextChange} value={events.location_image}/>

        <br/>
        <label htmlFor="summary">Summary</label>
        <textarea type="text" id="summary" onChange={handleTextChange} value={events.summary}/>
        <br />

        <input type="submit" />
      </form>
    </div>
  );
}
