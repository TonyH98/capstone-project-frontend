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

console.log(comment)
return(
    <div className="Edit">
    <form onSubmit={handleSubmit}>
      <br></br>
      <input
        id="comment"
        value={comment.comment}
        type="text"
        onChange={handleTextChange}
      />
      <input type="submit" />
    </form>
  </div>
)



}

export default CommentEdit