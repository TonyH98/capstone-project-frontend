
// commenter: currentUser.currentUserFullName,
//           profilePic: currentUser.currentUserImg,
//           profileLink: currentUser.currentUserProfile,

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
}, [])



useEffect(() => {
    
  if (users?.id) {
    setNewComment((prevChat) => ({ ...prevChat, user_id: users?.id }));
  }
}, [users?.id]);

// const handleDelete = (ids) => {
//   axios
//   .delete(`${API}/events/${id}/comments/${ids}`)
//   .then(() => {
//     const copyCommentsArray = [...comments]
//     const indexDeletedComments = copyCommentsArray.findIndex((comment) => {
//       return comment.id === id
//     })

//     copyCommentsArray.splice(indexDeletedComments,1)
//     setComments(copyCommentsArray)
//   })
// }


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

console.log(newComment)


  return (
    <div>
      <form onSubmit={handleSubmit}>
      <input
      type="text"
      id="comment"
      value={newComment.comment}
      onChange={handleTextChange}
      className="rounded-md sm:w-96 border-2 border-black"
      />
       <button type="submit" className="mx-1 hover:text-cyan-400 font-bold">Submit</button>
      </form>
      <div>
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