import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
// The page is only missing the axios call to post an event to the backend


const API = process.env.REACT_APP_API_URL
export default function NewEvent() {

  let navigate = useNavigate();

  let [users , setUsers] = useState({})

  const [events, setEvent] = useState({
    title: "",
    date_event: "",
    summary: "",
    max_people: "", // this value sets the max attendees allowed
    age_restriction: false,
    age_min: "",
    age_max: "",
    location: "",
    address: "",
    start_time: "",
    end_time: "",
    location_image: "",
    creator: users.id, //id of the user
    categoryIds: []
  });
  
let [category , setCategory] = useState([])


useEffect(() => {
  axios
  .get(`${API}/users/1`)
  .then((res) => {
    setUsers(res.data)
  })
  }, [])


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

const handleTextChange = (event) => {
  if (event.target.id === "categoryIds") {
    const { value } = event.target;

    if (!events.categoryIds.includes(value) && events.categoryIds.length < 3 && value) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        categoryIds: [...prevEvent.categoryIds, value],
      }));
    }
  } 
  else if (event.target.id === "age_min" || event.target.id === "age_max" || event.target.id === "max_people") {
    const { id, value } = event.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [id]: value ? Number(value) : "", // Convert to number if value exists, otherwise set it as an empty string
    }));
  }
  else {
    const { id, value } = event.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [id]: value,
    }));
  }
};



 


const filterCategory = (category) => {

const filter = events.categoryIds.filter((ele) => {
  return ele !== category
})

setEvent({...events, categoryIds: filter})

}

  function handleSubmit(event) {
    event.preventDefault();
    handleAdd(events)
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

        <label htmlFor="age_min">Minimum Age</label>
        <input type="number" id="age_min" onChange={handleTextChange} value={events.age_min}/>
        <br />

        <label htmlFor="age_max">Max Age</label>
        <input type="number" id="age_max" onChange={handleTextChange} value={events.age_max}/>
        <br />

        <label htmlFor="location">Location</label>
        <input type="text" id="location" onChange={handleTextChange} value={events.location}/>
        <br />

        <label htmlFor="max">Max Participants</label>
        <input type="number" id="max_people" onChange={handleTextChange} value={events.max_people}/>
        <br />

        <label htmlFor="date_event">Date</label>
        <input type="date" id="date_event" onChange={handleTextChange} value={events.date_event}/>
        <br />

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
