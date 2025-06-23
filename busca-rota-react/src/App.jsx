import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AllAirports from "./pages/AllAirports";
import AllAirlines from "./pages/AllAirlines";
import AirportDetail from './pages/AirportDetail';
import AirlineDetail from './pages/AirlineDetail';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-airports" element={<AllAirports />} />
        <Route path="/all-airlines" element={<AllAirlines />} />
        <Route path="/airport/:iata" element={<AirportDetail />} />
        <Route path="/airline/:id" element={<AirlineDetail />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
