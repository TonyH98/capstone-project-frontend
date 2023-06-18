import axios from "axios";
import React, { useState, useEffect } from "react";

import Comments from "./Comments";


const API = process.env.REACT_APP_API_URL;
const CommentSection = ({users, id}) => {
 

const [comments , setComments] = useState([])

const [newComment , setNewComment] = useState({
  events_id: Number(id),
  user_id: users?.id,
  comment: ""
})

useEffect(() => {
  axios
  .get(`${API}/events/${id}/comments`)
  .then((res) => {
    setComments(res.data)
  })
}, [comments])



useEffect(() => {
    
  if (users?.id) {
    setNewComment((prevChat) => ({ ...prevChat, user_id: users?.id }));
  }
}, [users?.id]);




const handleEdit = (updatedComments) => {
  axios
    .put(`${API}/events/${id}/comments/${updatedComments.id}`, updatedComments)
    .then((response) => {
      const copyComments = [...comments];
      const indexUpdatedComments = copyComments.findIndex((comment) => comment.id === updatedComments.id);
      copyComments[indexUpdatedComments] = response.data;
      setComments(copyComments);
    })
    .then(() => {
      axios.get(`${API}/events/${id}/comments`).then((res) => {
        setComments(res.data);
      });
    })
    .catch((error) => {
      console.warn("Error:", error);
    });
};




function handleNewComments(newComment) {
  axios
    .post(`${API}/events/${id}/comments`, newComment)
    .then(() => {
      if (id) {
        axios.get(`${API}/events/${id}/comments`).then((res) => {
          setComments(res.data);
          console.log(res.data);
        });
      }
    });
}


const handleTextChange = (event) => {
  setNewComment({...newComment, comment: event.target.value})
}


const handleSubmit = (event) => {
  event.preventDefault();
  handleNewComments(newComment);
  setNewComment((prevChat) => ({ ...prevChat, comment: "" }));
};

// console.log(newComment)
// console.log (users)

  return (
    <div className="pl-4">
      <form onSubmit={handleSubmit} className="mt-4 ml-4 grid grid-rows-2">
      <input
      type="text"
      id="comment"
      value={newComment.comment}
      onChange={handleTextChange}
      className="rounded-md sm:w-96 border-2 border-black w-1/3"
      />
       <button type="submit" className="mx-1 hover:text-cyan-400 font-bold place-self-start ml-28 rounded-full bg-purple-300 w-36 mt-2 font-bold text-lg">Submit</button>
      </form>
      <div className="comment mt-2">
        {comments.map((comment) => {
          return(

            <Comments
            key={comment.id}
            comment={comment}
            // handleDelete={handleDelete}
            handleEdit={handleEdit}
            users={users}
            id={id}
            setComments={setComments}
            />
          )
        })}
      </div>
    </div>
   
  )
};

export default CommentSection;