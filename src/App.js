import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import CustomerPage from './Customer/Customer';
import OwnerPage from './Owner/Owner';
import Login from './LoginPage/LoginPage';
import Signup from './LoginPage/SignUp';

function App() {
  return (
    <BrowserRouter>
        <div className="App">
        <Navbar />
        <Routes >
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/owner" element={<OwnerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
