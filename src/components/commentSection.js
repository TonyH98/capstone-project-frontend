import React from 'react'
import { useEffect, useState } from 'react'
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import useLocalStorage from '../hooks/useLocalStorage'


const CustomComponent = ({currentUser}) => {

  const userId = currentUser.currentUserId
// const data= []
//   const [data1, setCommentData] = useLocalStorage(userId,[])
  
// // console.log(data)
// // console.log(userId)

//   useEffect(() => {
//   setCommentData(userId)
//     console.log(data1)
  
//     },[])


const [data, setData] = useLocalStorage('comment',[])

  return <CommentSection
  
        currentUser={currentUser}
        // commentData={data}
        // onSubmitAction={(data= {
        //   userId: '',
        //   comId: '',
        //   avatarUrl: '',
        //   userProfile: '',
        //   fullName: '',
        //   text: '',
        //   replies: '',
        //   commentId: ''
        // }) => console.log('check submit, ', data)}
        // currentData={(data= '') => {
        //   console.log('curent data', data)
        // }}
        onSubmitAction={() =>
          setData([
            {
              userId: '',
              comId: '',
              avatarUrl: '',
              userProfile: '',
              fullName: '',
              text: '',
              replies: [],
              commentId: ''
            } 
          ])
        } 
        onDeleteAction={() => window.prompt('Are you sure?')}
        onReplyAction={() => alert('Reply was posted')}
        onEditAction={() => alert('Reply was edited!')}
        currentData={(data= '') => {
            console.log('curent data', data)
          }}
        
      />
}

export default CustomComponent