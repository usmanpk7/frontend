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
  const [allComments, setAllComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); 

  //Handling my new Comment
  function handleCommentSubmit(e) {
    e.preventDefault();
    if (newComment.trim() === '') {
      return;
    }

    const commentId = allComments?.length + 10;
    const newCommentObj = {
      id: commentId,
      image: user4,
      name: 'John Doe',
      comment: newComment,
      replies: [],
      isMe:true
    };

    allComments.push(newCommentObj)

    const allLocalStorageComments = JSON.parse(localStorage.getItem('comments')) ||allComments|| [];
    const updatedComments = [...allLocalStorageComments, newCommentObj];
    // debugger
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    setNewComment('');
  }

  // Handling the Like 
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


  //Removing My Comment
  function handleRemoveComment(commentId) {
    const updatedNewComments = allComments.filter((comment) => comment.id !== commentId);
    setAllComments(updatedNewComments);
    localStorage.removeItem('comments')
    localStorage.setItem('comments', JSON.stringify(allComments));
  }

  //Handling My Reply
  function handleReply(commentId, replyText) {
    const commentedIndex = allComments.findIndex((comment) => comment.id === commentId);

    if (commentedIndex !== -1) {
      const newReply = {
        id: newComments.length + 1, 
        image: user4,
        name: 'John Doe',
        comment: replyText,
        isMe:true
      };
      allComments[commentedIndex].replies.push(newReply);

      setAllComments([...allComments]);

      setReplyingTo(null);
      localStorage.removeItem('comments')
      localStorage.setItem('comments', JSON.stringify(allComments));
    }
  }

  //Removing the reply of the comments
  function removeCommentReply(id,replyIndex){
    allComments[id].replies.splice(replyIndex,1)
    setAllComments([...allComments]);
    localStorage.removeItem('comments')
    localStorage.setItem('comments', JSON.stringify(allComments));
  }

  useEffect(() => {
    const allComments = JSON.parse(localStorage.getItem('comments')) || [...comments];
    setAllComments([...allComments]);
  }, [])

  return (
    <ul className='comment-list'>
      { allComments && allComments?.map((comm,index) => {
        const { id, image, name, comment, replies, isMe } = comm;

        return (
          <li key={id}>
            <div className='parent'>
              <img src={image} alt={name} className='user-image'/>
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
                  {!isMe && 
                  <button
                    className='reply-btn'
                    onClick={() => setReplyingTo(id)} 
                  >
                    Reply
                  </button>
                 }
                     {isMe && 
     
              <button className='remove-btn' onClick={() => handleRemoveComment(id)}>
                Remove
              </button>
              }
                </div>
              </div>
            </div>
            {replyingTo === id && (
               <div className='reply-form'>
                <ReplyForm onSubmit={(replyText) => handleReply(id, replyText)} />
              </div>
            )}
        
            {/* Getting My replies */}
            <ul className='replies'>
              {replies?.map((reply,replyIndex) =>(
                 <li key={reply.id}>
                  <div className='parent'>
                    <img src={reply.image} alt={reply.name} className='user-image' />
                    <div className='child'>
                      <h3>{reply.name}</h3>
                      <p>{reply.comment}</p>
                      <div className='footer'>
                  {liked[id] ? (
                    <BsFillSuitHeartFill onClick={() => handleLike(id)} className='filled-heart' />
                  ) : (
                    <BsSuitHeart onClick={() => handleLike(id)} />
                  )}
                  <span>{count[id] || 0}</span>
                  <span className='dot'>.</span>
                  <button className='remove-btn' onClick={(e)=>{e.preventDefault();removeCommentReply(index,replyIndex)}}>
                    Remove
                  </button>
                </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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