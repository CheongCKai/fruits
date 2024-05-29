import React, { useState, useEffect } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { collection, query, getDocs, where, orderBy, onSnapshot } from 'firebase/firestore';

const OwnerChatBox = ({userUid}) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customersSnapshot = await getDocs(collection(db, 'users'));
                const customersData = customersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    userUid: doc.id
                }));
                setCustomers(customersData);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const fetchMessages = async (customerUid) => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'), where('userUid', '==', customerUid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate(),
            }));
            setMessages(fetchedMessages);
        });

        return unsubscribe;
    };

    const handleCustomerClick = async (customerUid) => {
        setSelectedCustomer(customerUid);
        await fetchMessages(customerUid);
    };

    const formatDate = (date) => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '20px auto',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#333'
            }}>Customer Chat History</h2>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}>
                <h3>Select a Customer:</h3>
                <ul style={{
                    listStyleType: 'none',
                    padding: 0
                }}>
                    {customers.map((customer) => (
                        <li key={customer.id} style={{
                            marginBottom: '5px',
                            cursor: 'pointer',
                            backgroundColor: selectedCustomer === customer.userUid ? '#f0f0f0' : 'transparent',
                            padding: '5px',
                            borderRadius: '4px'
                        }} onClick={() => handleCustomerClick(customer.userUid)}>
                            {customer.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{
                marginTop: '20px',
                borderTop: '1px solid #ccc',
                paddingTop: '10px'
            }}>
                <h3>Chat History with {selectedCustomer ? customers.find(cust => cust.userUid === selectedCustomer).name : ''}</h3>
                <ul style={{
                    listStyleType: 'none',
                    padding: 0
                }}>
                    {messages.map((message) => (
                        <li key={message.id} style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #eee',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{
                                marginBottom: '5px',
                                fontSize: '0.85em',
                                color: '#666'
                            }}>
                                <strong>{customers.find(cust => cust.userUid === message.userUid)?.name || 'Customer'}</strong>
                                <span style={{ marginLeft: '10px' }}>{formatDate(message.timestamp)}</span>
                            </div>
                            <div style={{
                                maxWidth: '80%',
                                wordWrap: 'break-word',
                                textAlign: 'left'
                            }}>
                                {message.text}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OwnerChatBox;
