
// commenter: currentUser.currentUserFullName,
//           profilePic: currentUser.currentUserImg,
//           profileLink: currentUser.currentUserProfile,
import React, { useState } from "react";

const CommentSection = ({ currentUser }) => {
 
  const [comments, setComments] = useState([
    {
      id: 1,
      commenter: "John",
      profilePic: "https://ui-avatars.com/api/name=John+&background=random",
      profileLink: "#",
      content: "OMG I can't wait!",
      replies: [],
    },
    {
      id: 2,
      commenter: "Jane",
      profilePic: "https://ui-avatars.com/api/name=Jane+&background=random",
      profileLink: "#",
      content: "where has this been all my life",
      replies: [
        {
          id: 3,
          commenter: "Alice",
          profilePic: "https://ui-avatars.com/api/name=Alice+&background=random",
          profileLink: "#",
          content: "I was thinking the same thing!",
          replies: [],
        },
      ],
    },
   
    {
      id: 4,
      commenter: "Eve",
      profilePic: "https://ui-avatars.com/api/name=Eve+&background=random",
      profileLink: "#",
      content: "Can I bring popcorn?",
      replies: [
        {
          id: 5,
          commenter: "Charlie",
          profilePic: "https://ui-avatars.com/api/name=Charlie+&background=random",
          profileLink: "#",
          content: "Eve! I knew i saw you on the RSVP list. I am so in there",
          replies: [],
        },
      ],
    },
  ]);

  const [newCommentValue, setNewCommentValue] = useState("");
  const [isReplying, setIsReplying] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [newReplyValue, setNewReplyValue] = useState("");

  const handleAddComment = () => {
    if (newCommentValue.trim() !== "") {
      if (selectedCommentId) {
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            if (comment.id === selectedCommentId) {
              const newReply = {
                id: comment.replies.length + 1,
                commenter: currentUser.currentUserFullName,
                profilePic: currentUser.currentUserImg,
                profileLink: currentUser.currentUserProfile,
                content: newReplyValue,
                replies: [],
              };
              return {
                ...comment,
                replies: [...comment.replies, newReply],
              };
            }
            return comment;
          });
        });
        setSelectedCommentId(null);
        setNewReplyValue("");
      } else {
        const newComment = {
          id: comments.length + 1,
          commenter: currentUser.currentUserFullName,
          profilePic: currentUser.currentUserImg,
          profileLink: currentUser.currentUserProfile,
          content: newCommentValue,
          replies: [],
        };
        setComments((prevComments) => [...prevComments, newComment]);
        setNewCommentValue("");
      }
    }
  };

  const getTotalComments = (comments) => {
    let count = 0;
    comments.forEach((comment) => {
      count++; // Increment count for each comment
      count += comment.replies.length; // Increment count for each reply
      count += getTotalComments(comment.replies); // Recursively count replies of replies
    });
    return count;
  };

  const totalComments = getTotalComments(comments);

  const handleReply = (parentId) => {
    setSelectedCommentId(parentId);
    setIsReplying((prevIsReplying) => ({
      ...prevIsReplying,
      [parentId]: true,
    }));
    setNewReplyValue("");
  };

  const handleAddReply = (parentId) => {
    if (newReplyValue.trim() !== "") {
      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment.id === parentId) {
            const newReply = {
              id: comment.replies.length + 1,
              commenter: currentUser.currentUserFullName,
              profilePic: currentUser.currentUserImg,
              profileLink: currentUser.currentUserProfile,
              content: newReplyValue,
              replies: [],
            };
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }
          return comment;
        });
      });
      setIsReplying((prevIsReplying) => ({
        ...prevIsReplying,
        [parentId]: false,
      }));
      setNewReplyValue("");
    }
  };

  const handleEdit = (commentId) => {
    setIsEditing(commentId);
  };

  const handleSaveEdit = (commentId, updatedContent) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, content: updatedContent } : comment
      )
    );
    setIsEditing(null);
  };

  const handleDelete = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const handleCancelReply = (parentId) => {
    setSelectedCommentId(null);
    setIsReplying((prevIsReplying) => ({
      ...prevIsReplying,
      [parentId]: false,
    }));
    setNewReplyValue("");
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  const renderReplies = (replies, parentId) => {
    return replies.map((reply) => (
      <div key={reply.id} className="comment-reply ml-10 mt-2">
        <div className="commenter-info flex">
          <img src={reply.profilePic} alt="Profile" />
          <a href={reply.profileLink} className="mt-6 pl-2">
            {reply.commenter}
          </a>
        </div>
        <div className="comment-content ml-20 pl-3 bg-slate-200 rounded-full w-fit pr-3"
        >{reply.content}</div>
        <div className="comment-actions ml-4">
          <button onClick={() => handleReply(reply.id)} className="ml-20 mt-2 bg-cyan-200 rounded-full w-16">
            Reply
          </button>
          <button onClick={() => handleEdit(reply.id)} className="ml-20 mt-2 w-16 bg-cyan-200 rounded-full">
            Edit
          </button>
          <button onClick={() => handleDelete(reply.id)} className="ml-20 mt-2 w-16 bg-cyan-200 rounded-full">
            Delete
          </button>
        </div>
        {isEditing === reply.id ? (
          <div>
            <textarea
              value={reply.content}
              className="ml-20"
              onChange={(e) => handleSaveEdit(reply.id, e.target.value)}
            />
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : null}
        {isReplying[reply.id] ? (
          <div className="grid grid-rows-2"> 
            <textarea
            className="w-1/3 ml-24 mt-2"
              value={newReplyValue}
              onChange={(e) => setNewReplyValue(e.target.value)}
            />
            <p className="place-self-start ml-8">
            <button onClick={() => handleCancelReply(reply.id)}
            className="ml-20 mt-2 bg-cyan-200 rounded-full w-20"
            >Cancel</button>
            <button 
            onClick={() => handleAddReply(reply.id)}
            className="ml-20 mt-2 bg-cyan-200 rounded-full w-20"
            >Post Reply</button>
            </p>
          </div>
        ) : null}
        {reply.replies.length > 0 && renderReplies(reply.replies, parentId)}
      </div>
    ));
  };

  return (
    <div className="comment-section">
      <div className="comment-count">Total Comments: {totalComments}</div>
      <div className="comment-form mt-4 ml-4 grid grid-rows-2">
        <textarea
          placeholder="Write a comment..."
          className="w-1/3"
          value={newCommentValue}
          onChange={(e) => setNewCommentValue(e.target.value)}
        />
        <button onClick={handleAddComment}
        className="place-self-start ml-28 rounded-full bg-purple-300 w-36 mt-2 font-bold text-lg"
        >Post Comment</button>
      </div>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment mt-2">
            <div className="commenter-info flex">
              <img src={comment.profilePic} alt="Profile" />
              <a href={comment.profileLink} className="mt-6 pl-2">
                {comment.commenter}
              </a>
            </div>
            <div className="comment-content ml-20 pl-3 bg-slate-200 rounded-full w-fit pr-3"
            >{comment.content}</div>
            <div className="comment-actions ml-4">
              <button onClick={() => handleReply(comment.id)} className="ml-20 mt-2 bg-cyan-200 rounded-full w-16">
                Reply
              </button>
              <button onClick={() => handleEdit(comment.id)} className="ml-20 mt-2 w-16 bg-cyan-200 rounded-full">
                Edit
              </button>
              <button onClick={() => handleDelete(comment.id)} className="ml-20 mt-2 w-16 bg-cyan-200 rounded-full">
                Delete
              </button>
            </div>
            {isEditing === comment.id ? (
              <div>
                <textarea
                  value={comment.content}
                  className="ml-16 pl-1"
                  onChange={(e) => handleSaveEdit(comment.id, e.target.value)}
                />
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : null}
            {isReplying[comment.id] && isReplying[comment.id] !== null ? (
              <div className="grid grid-rows-2"> 
              <textarea
              className="w-1/3 ml-24 mt-2"
                value={newReplyValue}
                onChange={(e) => setNewReplyValue(e.target.value)}
              />
              <p className="place-self-start ml-8">
              <button onClick={() => handleCancelReply(comment.id)}
              className="ml-20 mt-2 bg-cyan-200 rounded-full w-16"
              >Cancel</button>
              <button 
              onClick={() => handleAddReply(comment.id)}
              className="ml-20 mt-2 bg-cyan-200 rounded-full w-20"
              >Post Reply</button>
              </p>
            </div>
            ) : null}
            {comment.replies.length > 0 && renderReplies(comment.replies, comment.id)}
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default CommentSection;