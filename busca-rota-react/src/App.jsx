import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AllAirports from "./pages/AllAirports";
import AllAirlines from "./pages/AllAirlines";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-airports" element={<AllAirports />} />
        <Route path="/all-airlines" element={<AllAirlines />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
