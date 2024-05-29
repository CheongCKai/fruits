import React, { useState, useEffect } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

const ChatBox = ({ userUid }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userNames, setUserNames] = useState({});

    // Fetch user names once and store them
    useEffect(() => {
        const fetchUserNames = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const users = usersSnapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data().name;
                    return acc;
                }, {});
                setUserNames(users);
            } catch (error) {
                console.error('Error fetching user names:', error);
            }
        };

        fetchUserNames();
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                username: userNames[doc.data().userUid] || 'Customer',
                timestamp: doc.data().timestamp.toDate(),
            })).filter(message => message.userUid === userUid || message.recipient === userUid);
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [userNames, userUid]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            const docRef = await addDoc(collection(db, 'messages'), {
                text: newMessage,
                userUid: userUid,
                recipient: "eGSa2IGXhzPJ5hEnz8ta78DOs1F2", // Send message to Admin
                timestamp: new Date(),
            });
            console.log('Message sent with ID: ', docRef.id);
            setNewMessage('');
        } catch (error) {
            console.error('Error adding message:', error);
        }
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
            }}>Chat with Us!</h2>
            <ul style={{
                listStyleType: 'none',
                padding: 0,
                maxHeight: '400px',
                overflowY: 'scroll'
            }}>
                {messages.map((message) => (
                    <li key={message.id} style={{
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #eee',
                        backgroundColor: message.userUid === userUid ? '#ccffcc' : '#f0f0f0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.userUid === userUid ? 'flex-end' : 'flex-start',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            marginBottom: '5px',
                            fontSize: '0.85em',
                            color: '#666'
                        }}>
                            <strong style={{
                                color: message.userUid === userUid ? '#333' : '#000'
                            }}>{message.userUid === userUid ? 'You' : message.username}</strong>
                            <span style={{ marginLeft: '10px' }}>{formatDate(message.timestamp)}</span>
                        </div>
                        <div style={{
                            maxWidth: '80%',
                            wordWrap: 'break-word',
                            textAlign: message.userUid === userUid ? 'right' : 'left'
                        }}>
                            {message.text}
                        </div>
                    </li>
                ))}
            </ul>
            <form style={{
                display: 'flex',
                marginTop: '10px'
            }} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />
                <button type="submit" style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginLeft: '5px'
                }}>Send</button>
            </form>
        </div>
    );
};

export default ChatBox;
