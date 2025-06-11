"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [users, setUsers] = useState([])
  const [stations, setStations] = useState([])
  const [bookings, setBookings] = useState([])

  // 🔁 Real-time Firestore fetch
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    const unsubStations = onSnapshot(collection(db, "stations"), (snap) => {
      setStations(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      setBookings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    return () => {
      unsubUsers()
      unsubStations()
      unsubBookings()
    }
  }, [])

  const login = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const register = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        register,
        users,
        stations,
        bookings,
        setStations,
        setBookings,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
