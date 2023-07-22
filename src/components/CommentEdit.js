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
    <form onSubmit={handleSubmit} className="lg:grid lg:grid-rows-2">
      <br></br>
      <input
        id="comment"
        value={comment.comment}
        type="text"
        onChange={handleTextChange}
        className="lg:ml-20 lg:pl-3 lg:bg-orange-200 lg:rounded-full lg:w-fit lg:pr-"
      />
      <input type="submit" className="lg:ml-36 lg:mt-2 lg:w-16 lg:bg-cyan-200 lg:rounded-full" />
    </form>
  </div>
)



}

export default CommentEdit