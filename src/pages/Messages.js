import React from 'react';
import RoomsList from '../components/RoomsList';

const Messages = ({user, setUser, users, setUsers}) => {


  return (
    <div>
      <RoomsList user={user} setUser={setUser} users={users} setUsers={setUsers} />
    </div>
  );
};

export default Messages;
