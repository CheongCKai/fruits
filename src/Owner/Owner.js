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
import OwnerChatBox from '../Components/OwnerChatBox';

const OwnerPage = () => {
  const [activeContent, setActiveContent] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  
  const userName = localStorage.getItem('userName') || 'Owner';
  const auth = getAuth();
  const user = auth.currentUser;
  const userUid = user ? user.uid : null;

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
        <>
        <OwnerChatBox userUid={userUid}/>
        </>
      )}
      
    </div>
  );
};

export default OwnerPage;
