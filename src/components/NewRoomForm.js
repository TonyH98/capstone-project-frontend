import React, { useState } from "react";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

function NewRoomForm() {
  const [user2Id, setUser2Id] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/rooms`, {
        user2_id: user2Id,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Create New Room</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID of the other person:{" "}
          <input
            type="text"
            value={user2Id}
            onChange={(e) => setUser2Id(e.target.value)}
          />
        </label>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}

export default NewRoomForm;
