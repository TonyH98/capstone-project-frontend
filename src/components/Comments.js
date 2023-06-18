import axios from "axios";
import CommentEdit from "./CommentEdit";
import { useState } from "react";

const API = process.env.REACT_APP_API_URL;
function Comments({handleEdit, comment, users, id, setComments}){

    const [hidden , setHidden] = useState(false)

    const toggleView = () => {
        setHidden(!hidden)
    }

const handleDelete = (deleteId) => {
  console.log(deleteId)
  axios.delete(`${API}/events/${id}/comments/${deleteId}`)
  .then(() => {
    axios.get(`${API}/events/${id}/comments`)
    .then((res) => {
      setComments(res.data)
    })
  })
}

console.log(comment.id)

return(
    <div>
    {hidden ? (<CommentEdit id={id} CommentDetails={comment} toggleView={toggleView} handleEdit={handleEdit}/>) : (
      <>
        <div>
            <div>
                {comment?.time}
                {comment?.creator?.first_name} {comment.creator?.last_name}
                {comment?.comment}
            </div>
        </div>
      </>
    )}
    <br></br>
    <div>
      {users?.id === comment?.creator?.user_id ? (
        <>
        <button  className="delete" onClick={() => handleDelete(comment.id)} >delete</button> <button className="edit" onClick = {toggleView}>edit</button>
        </>
      ) : null}
    </div>
  </div>
)

}

export default Comments