import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import User from './User'

const API = process.env.REACT_APP_API_URL

export default function Users() {
    const [users, setUsers] = useState([])

     // useEffect makes get request for all Users
     useEffect(() => {
        axios
          .get(`${API}/users`)
          .then((res) => {
            setUsers(res.data);
            console.log(res.data);
        })
        .catch((c) => console.warn("catch, c"));
    }, []);
  return (
    <div className='flex flex-col items-center justify-center p-4'>
        <h1 className='text-2xl font-semibold'>All Users</h1>
        <div className='flex flex-col gap-6 sm:w-full md:w-[65%]'>
        {users.map(user => (
            <User key={user.id} user={user} />
        ))}
        </div>
    </div>
  )
}
