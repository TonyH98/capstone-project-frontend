import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", {});

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
