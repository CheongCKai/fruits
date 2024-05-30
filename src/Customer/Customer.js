import React, { useEffect, useState } from 'react';
import FruitSelection from './FruitsCollection';
import OrderFruit from './OrderFruit';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { ButtonSignOut, ContentContainer, HeaderContainer, NavItem, PageContainer,} from './CustomerStyle';
import OrderHistory from './OrderHistory';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import ContactUs from './ContactUs';
import FruitFAQ from './CustomerFAQ';


const CustomerPage = () => {
  const [fruits, setFruits] = useState([]);
  const [activeContent, setActiveContent] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';
  const auth = getAuth();
  const user = auth.currentUser;
  const userUid = user ? user.uid : null;
  
  console.log(location.state);
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
    <PageContainer>
      <HeaderContainer>
      <h1>Hi {userName}, <br/>Welcome To Raid Fruits!</h1>
      <ButtonSignOut onClick={handleSignOut}>Sign Out</ButtonSignOut>
      </HeaderContainer>

      <ContentContainer>
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
          <NavItem
            active={activeContent === "faq"}
            onClick={() => setActiveContent("faq")}
          >
            FAQ
          </NavItem>
          <NavItem
            active={activeContent === "contactUs"}
            onClick={() => setActiveContent("contactUs")}
          >
            Contact Us
          </NavItem>

      {activeContent === "home" && (
        <FruitSelection fruits={fruits} />
      )}

      {activeContent ==="order" &&(
        <OrderFruit fruits={fruits} userUid={userUid} />
      )}

      {activeContent === "history" && (
        <OrderHistory userUid={userUid}/>
      )}

      {activeContent === "faq" && (
        <FruitFAQ/>
      )}

      {activeContent === "contactUs" && (
          <ContactUs userUid={userUid}/>
      )}
      </ContentContainer>
    </PageContainer>
  );
};

export default CustomerPage;