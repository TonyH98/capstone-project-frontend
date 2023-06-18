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

const defaultProf = `https://ui-avatars.com/api/name=`+comment?.creator?.first_name+`&background=random`



return(
    <div className="rounded-md sm:w-96 border-2 border-black mt-4">
    {hidden ? (<CommentEdit 
    id={id} 
    CommentDetails={comment} 
    toggleView={toggleView} 
    handleEdit={handleEdit}/>) : (
      <>
        <div className="flex mt-4 pl-2">
            {users.profile_img === "https://www.pngitem.com/pimgs/m/24-248366_profile-clipart-generic-user-generic-profile-picture-gender.png" ? (<img src={defaultProf}></img>):
            <img src={users.profile_img}></img>}
            <div className="pl-2 mt-6">
            {comment?.creator?.first_name} {comment.creator?.last_name}

            </div>
            <div className="pl-6 mt-6">
                {comment?.time}
            </div>
            <div className=" mt-16 absolute left-[6rem] pl-5 bg-slate-200 rounded-full w-fit pr-5 ">
            {comment?.comment}

            </div>
            
        </div>
     
   <></>
    <div>
      {users?.id === comment?.creator?.user_id ? (


        < div className='comment-buttons ml-28 mt-10'>
        <button  className="delete bg-cyan-200 rounded-full w-16" 
        onClick={() => handleDelete(comment.id)}>
          Delete
        </button> 
        <button className="edit ml-6 bg-cyan-200 rounded-full w-10 mb-4" 
        onClick = {toggleView}>
          Edit
        </button>
        </div>


      ) : null}
    </div>
   </>
   )}
   </div>
)

}

export default Comments