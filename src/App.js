
import React, { useState } from 'react'
import data from './utils/data'
import CommentList from './CommentList'

export default function App() {
  const [comments, setComments]=useState(data)
  return (
    <div className='app'> 
           <CommentList comments={data} />
    </div>
  )
}
