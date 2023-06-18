import { useState , useEffect } from "react";


function CommentEdit({id , CommentDetails, toggleView, handleEdit}){

   

    const [comment , setComment] = useState({
      events_id: id,
      time: "",
      creator: {
        first_name: "",
        last_name: "",
        user_id: ""
      },
      comment: ""
    })



    const handleTextChange = (event) => {
        setComment({ ...comment, [event.target.id]: event.target.value });
      };
    

      useEffect(() => {
        if (CommentDetails) {
          setComment(CommentDetails);
        }
      }, [id, CommentDetails]);


      const handleSubmit = (event) => {
        event.preventDefault();
        handleEdit(comment, id);
        if (CommentDetails) {
          toggleView();
        }
      };

return(
    <div className="Edit">
    <form onSubmit={handleSubmit} className="grid grid-rows-2">
      <br></br>
      <input
        id="comment"
        value={comment.comment}
        type="text"
        onChange={handleTextChange}
        className="ml-20 pl-3 bg-orange-200 rounded-full w-fit pr-"
      />
      <input type="submit" className="ml-36 mt-2 w-16 bg-cyan-200 rounded-full" />
    </form>
  </div>
)



}

export default CommentEdit