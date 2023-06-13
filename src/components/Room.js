import React from 'react'

export default function Room({handleRoomClick, room, selectedRoom}) {

    
  return (
    <div className='px-1 py-2'>
        <li key={room?.id} onClick={() => handleRoomClick(room?.id)} className=''>
            {selectedRoom === room?.id ? 
            <p style={{color:"black", background: "#0cc0df", padding: "5px", borderRadius: "0.4em"}}>{room?.other_username}</p> :
            <p style={{color:"black", padding: "5px"}}>{room?.other_username}</p>}
        </li>
    </div>
  )
}
