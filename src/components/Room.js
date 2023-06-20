import React from 'react'

export default function Room({handleRoomClick, room, selectedRoom}) {

    
  return (
    <div className='px-1 py-2 border-b'>
        <li key={room?.id} onClick={() => handleRoomClick(room?.id)} className={`p-2 rounded-md ${selectedRoom === room?.id ? 'bg-cyan-300' : ''}`}>
            <p >{room?.other_username}</p>
        </li>
    </div>
  )
}
