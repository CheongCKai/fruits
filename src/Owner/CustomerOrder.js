import React, { useEffect, useState } from 'react';
import api from '../api'; 
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
          const response = await api.get('/orders');
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      };
      fetchOrders();
    }, []);

    useEffect(() => {
      const fetchUserNames = async () => {
        try {
          const response = await api.get('/users');
          const usersData = response.data.reduce((acc, user) => {
            acc[user.id] = user.name;
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
      return new Date(date).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
      });
    };

    const convertFirestoreTimestampToDate = (timestamp) => {
      if (!timestamp || typeof timestamp._seconds !== 'number' || typeof timestamp._nanoseconds !== 'number') {
        return null;
      }
      return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    };

    const handleCheckboxChange = (order) => {
      setOrderToUpdate(order);
    };
  
    const handleUpdateStatus = async () => {
      if (orderToUpdate) {
        try {
          await api.put(`/orders/${orderToUpdate.id}`, { status: 'Completed' });
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderToUpdate.id ? { ...order, status: 'Completed' } : order
            )
          );
        } catch (error) {
          console.error('Error updating order status:', error);
          alert('Failed to update order status.');
        } finally {
          setOrderToUpdate(null);
        }
      }
    };

    const toggleSortOrder = () => {
      setIsLatestFirst(!isLatestFirst);
    };
  
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = convertFirestoreTimestampToDate(a.purchasedate);
      const dateB = convertFirestoreTimestampToDate(b.purchasedate);
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
                  <th>
                    Purchase Date
                    <SortToggle 
                      isToggled={isLatestFirst}
                      toggleSortOrder={toggleSortOrder}
                    />
                  </th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
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
                    <td>{formatDate(convertFirestoreTimestampToDate(order.purchasedate))}</td>
                    <td style={{ 
                      color: order.status === 'Completed' ? 'green' : 'red', 
                      fontWeight: 'bold' 
                    }}>
                      {order.status}
                      {order.status === 'Not Completed' && (
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
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </CustomerDetailTable>
        </OwnerViewCusContainer>
    );
};

export default CustomerOrder;
