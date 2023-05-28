import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function User({user}) {
    const navigate = useNavigate();

console.log(user.profile_img)

  return (
    <div className='bg-cyan-100 shadow-lg p-4 rounded-md flex justify-between'>
        <div>
            <img src={user.profile_img} alt={`${user.first_name} profile image`}></img>
            <div>
                <h3>{user.first_name}{" "}{user.last_name}</h3>
                <h3 className='text-cyan-400 font-bold'>@{user.username}</h3>
            </div>
        </div>
        <button onClick={() => navigate('/chats')} className='border-2 border-cyan-400 px-2 my-4 rounded-md'>
            <Link to='/chats'>Message</Link>
        </button>
    </div>
  )
}
