import CommentEdit from "./CommentEdit";
import { useState } from "react";

function Comments({handleDelete, handleEdit, comment, users, id}){

    const [hidden , setHidden] = useState(false)

    const toggleView = () => {
        setHidden(!hidden)
    }




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
        <button  className="delete" onClick={() => handleDelete(comment.id)}>delete</button> <button className="edit" onClick = {toggleView}>edit</button>
        </>
      ) : null}
    </div>
  </div>
)

}

export default Comments