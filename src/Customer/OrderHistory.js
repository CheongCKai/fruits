import React, { useEffect, useState } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection, where } from 'firebase/firestore';
import styled from 'styled-components';
import { HistoryContainer, OrderTable, ToggleButton } from './CustomerStyle';
import SortToggle from '../Components/SortToggle';
import ChatBox from '../Components/ChatBox';

// (userUid) passing as a prop object instead of a single parameter
const OrderHistory = ({userUid}) => {
    const [orders, setOrders] = useState([]);
    const [isLatestFirst, setIsLatestFirst] = useState(true);
    //const [sortedOrders, setSortedOrders] = useState([]);

  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Orders'));
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched Orders:', ordersData); 

          console.log('from the customer passing in userUid:', userUid);
          //view customerID
          ordersData.forEach(order => {
            console.log('Customer UID:', order.customerUid);
        });
          //filter the order based on userUid
          const userOrders = ordersData.filter(order => order.customerUid === userUid);
          console.log('Filtered Orders:', userOrders);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      };
      fetchOrders();
    }, [userUid]);

    const formatDate = (date) => {
      return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
      });
  };

  const toggleSortOrder = () => {
    setIsLatestFirst(!isLatestFirst);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.purchasedate.toDate();
    const dateB = b.purchasedate.toDate();
    return isLatestFirst ? dateB - dateA : dateA - dateB;
  });

    return (
        <HistoryContainer>
            <h2>Fruit Transactions</h2>
            <OrderTable>
            <thead>
          <tr>
            <th>Order Name</th>
            <th>Cost Per Item</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Purchase Date
                <SortToggle 
                 isToggled={isLatestFirst}
                toggleSortOrder={toggleSortOrder}
               />
            </th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
        {sortedOrders.length === 0 ? (
            <tr>
                <td colSpan="5" 
                style={{ fontSize: '22px',fontWeight: 'bold' }}>It's empty here...</td>
            </tr>
          ) : (
          sortedOrders.map(order => (
            <tr key={order.id}>
              <td>
                {order.order.map(item => (
                  <div key={item.fruit}>{item.fruit}</div>
                ))}
              </td>
              <td>
                {order.order.map(item => (
                    <div key={item.fruit}>${item.price}</div>
                ))}
              </td>
              <td>
                {order.order.map(item => (
                  <div key={item.fruit}>{item.quantity}</div>
                ))}
              </td>
              <td>${order.totalCost}</td>
              <td>{formatDate(order.purchasedate.toDate())}</td>
              <td style={{ color: order.status === 'Completed' ? 'green' : 'black',
                fontWeight: 'bold'
               }}>{order.status}</td>
            </tr>
          )))}
        </tbody>
            </OrderTable>
        </HistoryContainer>

    )
};

export default OrderHistory;