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
  <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-100 rounded-md">
    <label htmlFor="comment" className="text-lg font-bold">
      Edit Comment
    </label>
    <input
      id="comment"
      value={comment.comment}
      type="text"
      onChange={handleTextChange}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
    />
    <button
      type="submit"
      className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
    >
      Save
    </button>
  </form>
</div>
)



}

export default CommentEdit