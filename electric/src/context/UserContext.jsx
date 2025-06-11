"use client"

import { createContext, useContext, useState } from "react"

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

  const [bookings, setBookings] = useState([
    {
      id: 1,
      stationId: 1,
      stationName: "Tesla Supercharger Downtown",
      date: "2024-01-15",
      time: "14:30",
      duration: 45,
      chargerType: "DC Fast",
      cost: 23.5,
      status: "completed",
      rating: 5,
    },
    {
      id: 2,
      stationId: 2,
      stationName: "EV Hub Mall Plaza",
      date: "2024-01-20",
      time: "10:15",
      duration: 60,
      chargerType: "Level 2",
      cost: 18.0,
      status: "upcoming",
      rating: null,
    },
    {
      id: 3,
      stationId: 3,
      stationName: "GreenCharge Highway Stop",
      date: "2024-01-25",
      time: "16:45",
      duration: 30,
      chargerType: "DC Fast",
      cost: 15.75,
      status: "upcoming",
      rating: null,
    },
  ])

  const [stations, setStations] = useState([
    {
      id: 1,
      name: "Tesla Supercharger Downtown",
      location: "Downtown District",
      address: "123 Main St, City Center",
      chargerTypes: ["DC Fast", "Level 2"],
      pricePerMinute: { "DC Fast": 0.65, "Level 2": 0.35 },
      availability: { "DC Fast": 3, "Level 2": 2 },
      rating: 4.8,
      reviews: 124,
      amenities: ["WiFi", "Restroom", "Cafe"],
      status: "active",
      companyId: 1,
    },
    {
      id: 2,
      name: "EV Hub Mall Plaza",
      location: "Shopping District",
      address: "456 Plaza Ave, Mall Complex",
      chargerTypes: ["Level 2", "Level 1"],
      pricePerMinute: { "Level 2": 0.3, "Level 1": 0.2 },
      availability: { "Level 2": 1, "Level 1": 4 },
      rating: 4.5,
      reviews: 89,
      amenities: ["Shopping", "Food Court", "Parking"],
      status: "active",
      companyId: 2,
    },
    {
      id: 3,
      name: "GreenCharge Highway Stop",
      location: "Highway 101",
      address: "789 Highway 101, Mile Marker 45",
      chargerTypes: ["DC Fast"],
      pricePerMinute: { "DC Fast": 0.7 },
      availability: { "DC Fast": 2 },
      rating: 4.2,
      reviews: 67,
      amenities: ["Convenience Store", "Restroom"],
      status: "active",
      companyId: 3,
    },
  ])

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

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: bookings.length + 1,
      status: "upcoming",
    }
    setBookings([...bookings, newBooking])
  }

  const updateBooking = (id, updates) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)))
  }

  const addStation = (station) => {
    const newStation = {
      ...station,
      id: stations.length + 1,
      status: "pending",
    }
    setStations([...stations, newStation])
  }

  const updateStation = (id, updates) => {
    setStations(stations.map((station) => (station.id === id ? { ...station, ...updates } : station)))
  }

  const deleteStation = (id) => {
    setStations(stations.filter((station) => station.id !== id))
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
        bookings,
        setBookings,
        addBooking,
        updateBooking,
        stations,
        setStations,
        addStation,
        updateStation,
        deleteStation,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
