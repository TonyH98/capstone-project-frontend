import React from 'react'

export default function Room({handleRoomClick, room}) {
  const { id, other_username } = room;
    
  return (
    <div>
        <li key={id} onClick={() => handleRoomClick(id)}>
          <button>{other_username}</button>
        </li>
    </div>
  )
}
