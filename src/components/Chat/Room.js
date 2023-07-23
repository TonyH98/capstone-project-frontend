import React from 'react'

export default function Room({handleRoomClick, room, selectedRoom}) {

    
  return (
    <div className='chat-room-rooms lg:px-1 lg:py-2 lg:border-b'>
        <li key={room?.id} onClick={() => handleRoomClick(room?.id)} className={`chat-room-username lg:p-2 lg:rounded-md ${selectedRoom === room?.id ? 'chat-room-selected lg:bg-cyan-300' : ''}`}>
            <p >{room?.other_username}</p>
        </li>
    </div>
  )
}
