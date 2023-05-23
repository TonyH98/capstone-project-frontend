import React from 'react'

export default function User({user}) {

console.log(user.profile_img)

  return (
    <div className='bg-cyan-100 shadow-lg p-4 rounded-md flex'>
        <img src={user.profile_img} alt={`${user.first_name} profile image`}></img>
        <div>
            <h3>{user.first_name}{" "}{user.last_name}</h3>
            <h3 className='text-cyan-400 font-bold'>@{user.username}</h3>
        </div>
    </div>
  )
}
