import React, { useEffect, useState } from 'react'
import {BsSuitHeart, BsFillSuitHeartFill} from 'react-icons/bs'
import { IoIosSend } from 'react-icons/io'
import user4 from './assets/images/user4.png'
import ReplyForm from './ReplyForm'


export default function CommentList({ comments }) {
  const [count, setCount] = useState({});
  const [liked, setLiked] = useState({});
  const [newComment, setNewComment] = useState('');
  const [newComments, setNewComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (newComment.trim() === '') {
      return;
    }

    const commentId = newComments.length + 10;
    const newCommentObj = {
      id: commentId,
      image: user4,
      name: 'John Doe',
      comment: newComment,
      replies: [],
    };

    setNewComments([...newComments, newCommentObj]);

    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    const updatedComments = [...allComments, newCommentObj];
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    setNewComment('');
  }

  function handleLike(id) {
    setLiked((prevLiked) => ({
      ...prevLiked,
      [id]: !prevLiked[id],
    }));

    setCount((prevCount) => ({
      ...prevCount,
      [id]: liked[id] ? prevCount[id] - 1 : (prevCount[id] || 0) + 1,
    }));
  }

  function handleRemoveComment(commentId) {
    const updatedNewComments = newComments.filter((comment) => comment.id !== commentId);
    setNewComments(updatedNewComments);

    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    const updatedComments = allComments.filter((comment) => comment.id !== commentId);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  }

  function handleReply(commentId, replyText) {
    // Find the comment being replied to
    const commentedIndex = newComments.findIndex((comment) => comment.id === commentId);

    if (commentedIndex !== -1) {
      // Add the reply to the specified comment's replies array
      const newReply = {
        id: newComments.length + 1, // Assign a unique ID to the reply
        image: user4,
        name: 'John Doe',
        comment: replyText,
      };
      newComments[commentedIndex].replies.push(newReply);

      // Update the newComments state with the updated comment
      setNewComments([...newComments]);

      // Clear the reply form and reset the replyingTo state
      setReplyingTo(null);
    }
  }

  useEffect(() => {
    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    setNewComments(allComments);
  }, [])

  return (
    <ul className='comment-list'>
      {comments.map((comm) => {
        const { id, image, name, comment, replies } = comm;

        return (
          <li key={id}>
            <div className='parent'>
              <img src={image} alt={name} />
              <div className='child'>
                <h3>{name}</h3>
                <p>{comment}</p>

                <div className='footer'>
                  {liked[id] ? (
                    <BsFillSuitHeartFill onClick={() => handleLike(id)} className='filled-heart' />
                  ) : (
                    <BsSuitHeart onClick={() => handleLike(id)} />
                  )}
                  <span>{count[id] || 0}</span>
                  <span className='dot'>.</span>
                  <button
                    className='reply-btn'
                    onClick={() => setReplyingTo(id)} // Set the comment ID for the reply
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
            {replyingTo === id && (
              <div className='reply-form'>
                <ReplyForm onSubmit={(replyText) => handleReply(id, replyText)} />
              </div>
            )}
            {/* Render replies */}
            <ul className='replies'>
              {replies.map((reply) => (
                <li key={reply.id}>
                  <div className='parent'>
                    <img src={reply.image} alt={reply.name} />
                    <div className='child'>
                      <h3>{reply.name}</h3>
                      <p>{reply.comment}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        );
      })}

      {/* Render the new comments with Remove button */}
      {newComments.map((comm) => {
        const { id, image, name, comment } = comm;

        return (
          <li key={id}>
            <div className='parent'>
              <img src={image} alt={name} />
              <div className='child'>
                <h3>{name}</h3>
                <p>{comment}</p>

                <div className='footer'>
                  {liked[id] ? (
                    <BsFillSuitHeartFill onClick={() => handleLike(id)} className='filled-heart' />
                  ) : (
                    <BsSuitHeart onClick={() => handleLike(id)} />
                  )}
                  <span>{count[id] || 0}</span>
                  <span className='dot'>.</span>
                  <button className='remove-btn' onClick={() => handleRemoveComment(id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}

      <form className='form' onSubmit={handleCommentSubmit}>
        <div className='input-container'>
          <input
            type='text'
            className='input-field'
            placeholder='Write your comment'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <IoIosSend className='send-icon' />
        </div>
      </form>
    </ul>
  );
}
