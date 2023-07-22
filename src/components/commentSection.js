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
      <h2 className="lg:text-lg lg:font-bold lg:mb-3">{comments.length} Comments</h2>
      <form onSubmit={handleSubmit} className="lg:flex lg:justify-center lg:items-center lg:gap-2">
      <div className="lg:flex lg:justify-center lg:items-center lg:gap-3">
      <label
                htmlFor="comments"
                className="lg:block lg:font-bold lg:mb-2"
              >
                Add your comment
              </label> 
      <input
      type="text"
      id="comment"
      value={newComment.comment}
      onChange={handleTextChange}
      className="lg:rounded-md lg:sm:w-96 lg:border-2 lg:border-black lg:px-1 lg:py-2"
      />
      </div>
       <button type="submit" className=" lg:hover:text-cyan-400 lg:place-self-start lg:py-2 lg:px-3 lg:rounded-md lg:bg-purple-300 lg:font-bold lg:text-lg">Submit</button>
      </form>
      <div className="lg:comment lg:mt-2 lg:flex lg:flex-col lg:justify-center lg:items-center">
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