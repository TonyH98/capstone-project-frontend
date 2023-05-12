import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
// The page is only missing the axios call to post an event to the backend


const API = process.env.REACT_APP_API_URL
export default function NewEvent() {


  let navigate = useNavigate();

  const [events, setEvent] = useState({
    title: "",
    categoryIds: [],
    age: 18,
    location: "",
    max: "", // this value sets the max attendees allowed
    date_event: "",
    start_time: "",
    end_time: "",
    summary: "",
    address: "",
    location_image: "",
    creator_id: "" //id of the user
  });
  
let [category , setCategory] = useState([])


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

}

const handleTextChange = (event) => {
  if (event.target.id === "categoryIds") {
    const { value } = event.target;

   if(!events.categoryIds.includes(value)){
    setEvent((prevEvent) => ({
      ...prevEvent,
      categoryIds: [...prevEvent.categoryIds, value],
    }));
   }
  } else {
    setEvent({ ...events, [event.target.id]: event.target.value });
  }
};


  const handleAgeChange = (event) => {
    setEvent({ ...event, age: parseInt(event.target.value) });
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


console.log(events)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" onChange={handleTextChange} />
        <br />

        <label htmlFor="categoryIds">Categories</label>
        <select id="categoryIds" onChange={handleTextChange}>
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
                  {category} <button onClick={() =>filterCategory(category)}>X</button>
                </div>
              )
            })}
          </div>
        ) : null}

        <label htmlFor="age">Age</label>
        <input type="number" id="age" onChange={handleAgeChange} />
        <br />

        <label htmlFor="location">Location</label>
        <input type="text" id="location" onChange={handleTextChange} />
        <br />

        <label htmlFor="max">Max Participants</label>
        <input type="number" id="max" onChange={handleTextChange} />
        <br />

        <label htmlFor="date_event">Date</label>
        <input type="date" id="date_event" onChange={handleTextChange} />
        <br />

        <label htmlFor="start_time">Start Time</label>
        <input type="time" id="start_time" onChange={handleTextChange} />
        <br />
        
        <label htmlFor="end_time">End Time</label>
        <input type="time" id="end_time" onChange={handleTextChange} />
        <br />
        
        <label htmlFor="address">Address</label>
        <input type="text" id="address" onChange={handleTextChange}/>

        <br/>
        <label htmlFor="summary">Summary</label>
        <textarea id="summary" onChange={handleTextChange} />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
