import React from 'react'
import Chats from '../components/Chats'

export default function Messages({ loggedin, setLoggedin, user, setUser, firebaseId }) {
  return (
    <div>
        <Chats loggedin={loggedin} setLoggedin={setLoggedin} user={user} setUser={setUser} firebaseId={firebaseId}/>
    </div>
  )
}
