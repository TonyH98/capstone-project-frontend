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

// declare a hash map for converting number date to text date with number to text conversions in monthObj
const months = new Map();
const monthObj = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

// sets entries in hash map where each numerical key value points to a text month
for (const key in monthObj) {
  months.set(key, monthObj[key]);
}

// declare variables to construct text date from numerical date
const numDate = comment?.time;
const monthName = months.get(numDate?.slice(5, 7));
let commentDate = `${monthName} ${parseInt(numDate?.slice(8))}, ${numDate?.slice(0,4)}`;


return(
    <div className="rounded-md sm:w-3/5 border-2 border-black mt-4">
    {hidden ? (<CommentEdit 
    id={id} 
    CommentDetails={comment} 
    toggleView={toggleView} 
    handleEdit={handleEdit}/>) : (
      <>
        <div className="">
            <div className="flex justify-between p-4">
              <div className="flex items-center gap-1">
              <img src={defaultProf} className="rounded-full"></img>
                {/* {users.profile_img === "https://www.pngitem.com/pimgs/m/24-248366_profile-clipart-generic-user-generic-profile-picture-gender.png" ? (<img src={defaultProf} className="rounded-full"></img>):
                <img src={users.profile_img} className="rounded-full w-20"></img>} */}
                <div className="">
                  {comment?.creator?.first_name} {comment.creator?.last_name}
                </div>
              </div>
              <div className="">
                {comment?.time}
              </div>
            </div>
            <div className="flex mb-8">
            <div className=" bg-slate-200 rounded-md px-2 py-3 w-96 ml-16">
            {comment?.comment}
            </div> 
            <div className="flex justify-center items-center gap-4 p-3">
      {users?.id === comment?.creator?.user_id ? (
        <div className='comment-buttons flex gap-2'>
          <button className="edit bg-cyan-400 hover:bg-purple-400 rounded-md px-4 py-0.5" 
        onClick = {toggleView}>
          Edit
        </button>
        <button  className="delete bg-cyan-400 hover:bg-orange-500 rounded-md px-2 py-0.5" 
        onClick={() => handleDelete(comment.id)}>
          Delete
        </button> 
        </div>


      ) : null}
    </div>
            </div>
        </div>
   </>
   )}
   </div>
)

}

export default Comments