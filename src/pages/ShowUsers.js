import React from 'react'
import Users from '../components/Users/Users'



export default function ShowUsers({user}) {
  return (
    <div>
        <Users user={user}/>
    </div>
  )
}
