import React from 'react'
import { useFriends } from '../contexts/FriendsProvider'

export default function Friends() {
    const { friends } = useFriends();
  return (
    <div>
        <ul>
            {friends.map(friend => (
                <li>
                    {friend.name}
                </li>
            ))}
        </ul>
    </div>
  )
}
