import React from 'react';
import FruitSelection from '../Customer/FruitsCollection';
import { useEffect, useState } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { NavItemOwner } from './OwnerStyle';
import StockUpdate from './StockUpdate';
import CustomerOrder from './CustomerOrder';

const OwnerPage = () => {
  const [activeContent, setActiveContent] = useState("home");

  return (
    <div>
      <h2>Welcome Owner!</h2>

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
