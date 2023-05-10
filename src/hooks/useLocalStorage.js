import { useEffect, useState } from "react";

// this prefix is the same name as our app title in the index.html file
const prefix = 'Kick.It';

// the purpose of this file is have one localStorage made for our entire app that will keep trask of all changes in our app and save info so that upon refresh users will not lose data.

// from here, all we have to do is use the function useLocalStorage whenever we are creating a new state that we want to persist.
// EXAMPLE: const [friends, setFriends] = useLocalStorage('friends', [])

export default function useLocalStorage(key, initialValue) {
    const prefixedKey = prefix + key;
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(prefixedKey);
        if (jsonValue !== null) return JSON.parse(jsonValue);
        if (typeof initialValue === 'function') {
            return initialValue();
        } else {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value))
    }, [prefixedKey, value])

  return [value, setValue];
}
