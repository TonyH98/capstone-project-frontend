import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const FriendsContext = React.createContext()

export function useFriends() {
  return useContext(FriendsContext)
}

export function FriendsProvider({ children }) {
  const [friends, setFriends] = useLocalStorage('friends', [])

  function createFriend(id, name) {
    setFriends(prevFriends => {
      return [...prevFriends, { id, name }]
    })
  }

  return (
    <FriendsContext.Provider value={{ friends, createFriend }}>
      {children}
    </FriendsContext.Provider>
  )
}