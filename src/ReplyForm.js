import React, { useState } from 'react';
import { IoIosSend } from 'react-icons/io';

// Define ReplyForm as a separate component
function ReplyForm({ onSubmit }) {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') {
      return;
    }

    onSubmit(replyText);
    setReplyText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        className='input-field'
        placeholder='Write your reply'
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <IoIosSend className='send-icon' />
    </form>
  );
}

export default ReplyForm