import React from 'react'

export default function User({user}) {
  return (
    <div>
        <h3>{user.first_name}</h3>
        <h3>{user.last_name}</h3>
    </div>
  )
}
