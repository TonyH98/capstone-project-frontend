import React from 'react'

export default function Room({handleRoomClick, room, selectedRoom}) {
    
  return (
    <div>
        <li key={room?.id} onClick={() => handleRoomClick(room?.id)}>
            {selectedRoom === room?.id ? 
            <p style={{color:"green"}}>{room?.other_username}</p> :
            <p style={{color:"black"}}>{room?.other_username}</p>}
        </li>
    </div>
  )
}
