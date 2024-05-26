import React, { useEffect, useState } from 'react';
import FruitSelection from './FruitsCollection';
import TrackFruit from './TrackFruit';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { NavItem } from './CustomerStyle';
import OrderHistory from './OrderHistory';

const CustomerPage = () => {
  const [fruits, setFruits] = useState([]);
  const [activeContent, setActiveContent] = useState("home");

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Fruits'));
        const fruitData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFruits(fruitData);
      } catch (error) {
        console.error('Error fetching fruit data:', error);
      }
    };

    fetchFruits();
  }, []);

  return (
    <div>
      <h1>Welcome To Raid Fruits!</h1>
      <NavItem
            active={activeContent === "home"}
            onClick={() => setActiveContent("home")}
          >
            Home
          </NavItem>
          
          <NavItem
            active={activeContent === "order"}
            onClick={() => setActiveContent("order")}
          >
            Order

          </NavItem>
          <NavItem
            active={activeContent === "history"}
            onClick={() => setActiveContent("history")}
          >
            History
          </NavItem>

      {activeContent === "home" && (
        <FruitSelection fruits={fruits} />
      )}

      {activeContent ==="order" &&(
        <TrackFruit fruits={fruits} />
      )}

      {activeContent === "history" && (
        <OrderHistory/>
      )}
      
    </div>
  );
};

export default CustomerPage;