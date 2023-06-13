import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ commenter, content, onEdit, onDelete, onReply, replies,profilePic,profileLink }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editText, setEditText] = useState(content);
  const [replyText, setReplyText] = useState('');

  const handleEditTextChange = (event) => {
    setEditText(event.target.value);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(content);
  };

  const handleEditSubmit = () => {
    onEdit(editText);
    setIsEditing(false);
  };

  const handleReplyCancel = () => {
    setIsReplying(false);
    setReplyText('');
  };

  const handleReplySubmit = () => {
    onReply(replyText);
    setIsReplying(false);
    setReplyText('');
  };

  return (
    <div className="comment">
    <img src={profilePic}
    alt='userIcon'></img>
      <Link to={`http://${profileLink}`}>{commenter}</Link>
      {isEditing ? (
        <textarea
          value={editText}
          onChange={handleEditTextChange}
          required
        ></textarea>
      ) : (
        <p>{content}</p>
      )}
      <div className="comment-actions">
        {!isEditing ? (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={onDelete}>Delete</button>
            {!isReplying && (
              <button onClick={() => setIsReplying(true)}>Reply</button>
            )}
          </>
        ) : (
          <>
            <button onClick={handleEditSubmit}>Save</button>
            <button onClick={handleEditCancel}>Cancel</button>
          </>
        )}
      </div>
      {isReplying && (
        <div className="reply-section">
          <textarea
            value={replyText}
            onChange={handleReplyChange}
            placeholder="Write a reply..."
            required
          ></textarea>
          <button onClick={handleReplySubmit}>Post Reply</button>
          <button onClick={handleReplyCancel}>Cancel</button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="replies">
          <h5>Replies:</h5>
          <ul>
            {replies.map((reply, index) => (
              <li key={index}>{reply}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Comment;
