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
    <div className="">
      <h2 className="text-lg font-bold mb-3">{comments.length} Comments</h2>

      <form onSubmit={handleSubmit} className="comment-form flex justify-center items-center  flex-row gap-2">
  <div>
    <label htmlFor="comments" className="block font-bold mb-2">
      Add your comment
      <input
        type="text"
        id="comment"
        value={newComment.comment}
        onChange={handleTextChange}
        className="flex rounded-md sm:w-96 border-2 border-black px-1 py-2"
      />
    </label>
  </div>
  <button type="submit" className="comment-form-button lg:hover:text-cyan-400 lg:py-2 lg:mt-3 lg:px-3 rounded-md bg-purple-300 font-bold lg:text-lg">
    Submit
  </button>
</form>



      <div className="lg:comment lg:mt-2 flex flex-col justify-center items-center">
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