import { useState } from "react";
import { useNavigate } from "react-router-dom";
// The page is only missing the axios call to post an event to the backend

export default function NewEvent() {
  let navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    categories: "",
    age: 18, // default value for age is 18
    location: "",
    max: "", // this value sets the max attendees allowed
    date: "",
    time: "",
    summary: "",
  });
  const categoryOptions = ["Option 1", "Option 2", "Option 3"]; // This is a placeholder until we have categories in the backend

  const handleTextChange = (event) => {
    setEvent({ ...event, [event.target.id]: event.target.value });
  };

  const handleAgeChange = (event) => {
    setEvent({ ...event, age: parseInt(event.target.value) });
  };

  function handleSubmit(event) {
    event.preventDefault();
    // the axios call to post will go here
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" onChange={handleTextChange} />
        <br />

        <label htmlFor="categories">Categories</label>
        <select id="categories" onChange={handleTextChange}>
          <option value="">Select a category</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="age">Age</label>
        <input type="number" id="age" onChange={handleAgeChange} />
        <br />

        <label htmlFor="location">Location</label>
        <input type="text" id="location" onChange={handleTextChange} />
        <br />

        <label htmlFor="max">Max Participants</label>
        <input type="number" id="max" onChange={handleTextChange} />
        <br />

        <label htmlFor="date">Date</label>
        <input type="date" id="date" onChange={handleTextChange} />
        <br />

        <label htmlFor="time">Time</label>
        <input type="time" id="time" onChange={handleTextChange} />
        <br />

        <label htmlFor="summary">Summary</label>
        <textarea id="summary" onChange={handleTextChange} />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
