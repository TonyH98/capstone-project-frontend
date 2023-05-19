import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useFriends } from './FriendsProvider';
import { useSocket } from './SocketProvider';

const MessagesContext = React.createContext()

export function useMessages() {
  return useContext(MessagesContext)
}

export function MessagesProvider({ id, children }) {
  const [messages, setMessages] = useLocalStorage('messages', [])
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(0)
  const { friends } = useFriends()
  const socket = useSocket()

  function createMessage(recipients) {
    setMessages(prevMessages => {
      return [...prevMessages, { recipients, messages: [] }]
    })
  };

  const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
    setMessages(prevMessages => {
      let madeChange = false
      const newMessage = { sender, text }
      const newMessages = prevMessages.map(m => {
        if (arrayEquality(m.recipients, recipients)) {
          madeChange = true
          return {
            ...m,
            messages: [...m.messages, newMessage]
          }
        }

        return m
      })

      if (madeChange) {
        return newMessages
      } else {
        return [
          ...prevMessages,
          { recipients, messages: [newMessage] }
        ]
      }
    })
  }, [setMessages])

  useEffect(() => {
    if (socket == null) return

    socket.on('receive-message', addMessageToConversation)

    return () => socket.off('receive-message')
  }, [socket, addMessageToConversation])

  function sendMessage(recipients, text) {
    socket.emit('send-message', { recipients, text })

    addMessageToConversation({ recipients, text, sender: id })
  }

  const formattedMessages = messages.map((message, index) => {
    const recipients = message.recipients.map(recipient => {
      const friend = friends.find(friend => {
        return friend.id === recipient
      })
      const name = (friend && friend.name) || recipient
      return { id: recipient, name }
    })

    const messages = message.messages.map(message => {
      const friend = friends.find(friend => {
        return friend.id === message.sender
      })
      const name = (friend && friend.name) || message.sender
      const fromMe = id === message.sender
      return { ...message, senderName: name, fromMe }
    })
    
    const selected = index === selectedMessageIndex
    return { ...message, messages, recipients, selected }
  })

  const value = {
    messages: formattedMessages,
    selectedMessage: formattedMessages[selectedMessageIndex],
    sendMessage,
    selectMessageIndex: setSelectedMessageIndex,
    createMessage
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((element, index) => {
    return element === b[index]
  })
}