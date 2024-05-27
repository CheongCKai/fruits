import React from 'react';
import FruitSelection from '../Customer/FruitsCollection';
import { useEffect, useState } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { NavItemOwner } from './OwnerStyle';
import StockUpdate from './StockUpdate';
import CustomerOrder from './CustomerOrder';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { ButtonSignOut } from '../Customer/CustomerStyle';

const OwnerPage = () => {
  const [activeContent, setActiveContent] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  
  const userName = localStorage.getItem('userName') || 'Owner';

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('userName');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div>
      <h2>Welcome {userName}!</h2>
        <ButtonSignOut onClick={handleSignOut}>Sign Out</ButtonSignOut>
       <NavItemOwner
            active={activeContent === "home"}
            onClick={() => setActiveContent("home")}
          >
            Home
          </NavItemOwner>
          
          <NavItemOwner
            active={activeContent === "order"}
            onClick={() => setActiveContent("order")}
          >
            Customer's Order

          </NavItemOwner>
          <NavItemOwner
            active={activeContent === "enquiries"}
            onClick={() => setActiveContent("enquiries")}
          >
            Enquiries
          </NavItemOwner>

      {activeContent === "home" && (
        <>
        <StockUpdate/>
        </>
      )}

      {activeContent ==="order" &&(
        <>
        <CustomerOrder/>
        </>
      )}

      {activeContent === "enquiries" && (
        <h1>hi</h1>
      )}
      
    </div>
  );
};

export default OwnerPage;
