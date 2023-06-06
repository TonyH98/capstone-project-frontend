import React from 'react'

export default function Room({handleRoomClick, room}) {
    
  return (
    <div>
        <li key={room.id} onClick={() => handleRoomClick(room.id)}>
            {room.username}
        </li>
    </div>
  )
}
