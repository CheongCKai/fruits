import React, { useEffect, useState } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection } from 'firebase/firestore';
import styled from 'styled-components';
import { HistoryContainer, OrderTable, ToggleButton } from './CustomerStyle';
import SortToggle from '../Components/SortToggle';
import { sortByDate } from '../Components/SortFunctions';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    //const [isLatestFirst, setIsLatestFirst] = useState(true);
    const [sortedOrders, setSortedOrders] = useState([]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Orders'));
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      };
  
      fetchOrders();
    }, []);

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
    // const toggleSortOrder = () => {
    //     setIsLatestFirst(!isLatestFirst);
    //   };
    
    //   // Sort orders by purchase date
    //   const sortedOrders = [...orders].sort((a, b) => {
    //     const dateA = a.purchasedate.toDate();
    //     const dateB = b.purchasedate.toDate();
    //     return isLatestFirst ? dateB - dateA : dateA - dateB;
    //   });

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
                {/* <ToggleButton onClick={toggleSortOrder}>
                    {isLatestFirst ?  "↑" : "↓"}
                </ToggleButton> */}
                <SortToggle 
                 items={orders}
                 setSortedItems={setSortedOrders}
                 sortFunction={sortByDate}
                 sortParams={[]} // No additional params needed for sortByDate
               />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map(order => (
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
            </tr>
          ))}
        </tbody>
            </OrderTable>
        </HistoryContainer>

    )
};

export default OrderHistory;