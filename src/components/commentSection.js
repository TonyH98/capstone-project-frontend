import React, { useState } from 'react';
import Comment from './Comment';

const CommentSection = ({currentUser}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    // Add the new comment to the comments array
    setComments([...comments, { content: newComment, replies: [] }]);

    // Clear the comment input
    setNewComment('');
  };

  const handleCommentEdit = (index, newText) => {
    // Update the comment text in the comments array
    const updatedComments = [...comments];
    updatedComments[index].content = newText;
    setComments(updatedComments);
  };

  const handleCommentDelete = (index) => {
    // Remove the comment from the comments array
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
  };

  const handleCommentReply = (index, replyText) => {
    // Add the reply to the replies array of the corresponding comment
    const updatedComments = [...comments];
    updatedComments[index].replies.push(replyText);
    setComments(updatedComments);
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      {comments.map((comment, index) => (
        <Comment
          key={index}
          commenter={currentUser.currentUserFullName}
          profilePic={currentUser.currentUserImg}
          profileLink={currentUser.currentUserProfile}
          content={comment.content}
          onEdit={(newText) => handleCommentEdit(index, newText)}
          onDelete={() => handleCommentDelete(index)}
          onReply={(replyText) => handleCommentReply(index, replyText)}
          replies={comment.replies}
        />
      ))}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Write a comment..."
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentSection;
