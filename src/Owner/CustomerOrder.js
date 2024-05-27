import React, { useEffect, useState } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { CustomerDetailTable, OwnerViewCusContainer } from './OwnerStyle';
import { ButtonAdd, ButtonEdit } from './OwnerStyle';
import SortToggle from '../Components/SortToggle';
import { sortByDate, sortByCompletion } from '../Components/SortFunctions';

const CustomerOrder = () => {
    const [orders, setOrders] = useState([]);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [isLatestFirst, setIsLatestFirst] = useState(true);
    const [customerNames, setCustomerNames] = useState({});
    
    
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

    //query the customeruid from "user" based on the "order"
    useEffect(() => {
      const fetchUserNames = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          const usersData = querySnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data().name; 
            return acc;
          }, {});
          setCustomerNames(usersData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      fetchUserNames();
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

  //checkbox for orderstatus, complete or not
    const handleCheckboxChange = (order) => {
      setOrderToUpdate(order);
    };
  
    const handleUpdateStatus = async () => {
      if (orderToUpdate) {
        try {
          await updateDoc(doc(db, 'Orders', orderToUpdate.id), { status: 'Completed' });
          //alert('Order status updated successfully!');
          
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderToUpdate.id ? { ...order, status: 'Completed' } : order
            )
          );
        } catch (error) {
          console.error('Error updating order status:', error);
          alert('Failed to update order status.');
        } finally {
          setOrderToUpdate(null); // Reset the selected order to update
        }
      }
    };

    // Sorting orders by date
    const toggleSortOrder = () => {
      setIsLatestFirst(!isLatestFirst);
    };
  
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = a.purchasedate.toDate();
      const dateB = b.purchasedate.toDate();
      return isLatestFirst ? dateB - dateA : dateA - dateB;
    });
    

    return (
        <OwnerViewCusContainer>
            <h2>Order Details</h2>

            <CustomerDetailTable>
            <thead>
          <tr>
            <th>Customer Name</th>
            <th>Fruits Ordered</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Purchase Date
            <SortToggle 
                 isToggled={isLatestFirst}
                 toggleSortOrder={toggleSortOrder}
               />
            </th>
            <th>Order Status
              {/* <SortToggle
               items={sortedOrders} // Pass sortedOrders to SortToggle instead of orders
               setSortedItems={setSortedOrders}
               sortFunction={sortByCompletion}
               sortParams={[sortCompletedFirst]}
             /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* SortedOrder instead of just order if want to do sorting */}
          {sortedOrders.map(order => (
            <tr key={order.id}>
              <td>{customerNames[order.customerUid]}</td>
              <td>
                {order.order.map(item => (
                  <div key={item.fruit}>{item.fruit}</div>
                ))}
              </td>
              <td>
                {order.order.map(item => (
                  <div key={item.fruit}>{item.quantity}</div>
                ))}
              </td>

              <td>${order.totalCost}</td>

              <td>{formatDate(order.purchasedate.toDate())}</td>
                {/* Font color for status */}
              <td style={{ 
                color: order.status === 'Completed' ? 'green' : 'red', 
                fontWeight: order.status === 'Completed' ? 'bold' : 'bold' 
              }}>

                {order.status}
                {order.status === 'Not Completed' ? (
                  <>
                    <input
                      type="checkbox"
                      checked={orderToUpdate === order}
                      onChange={() => handleCheckboxChange(order)}
                    />
                    {orderToUpdate === order && (
                      <div>
                        <p>Confirm status update?</p>
                        <ButtonEdit onClick={() => setOrderToUpdate(null)}>Cancel</ButtonEdit>
                        <ButtonAdd onClick={handleUpdateStatus}>Confirm</ButtonAdd>
                      </div>
                    )}
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
            </CustomerDetailTable>
        </OwnerViewCusContainer>
    )
};

export default CustomerOrder