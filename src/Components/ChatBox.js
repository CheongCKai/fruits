import React, { useState, useEffect } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { 
    ChatContainer, 
    HeadingOfChatBox, 
    MessageInfo, 
    MessageInput, 
    MessageItem, 
    MessageListChat, 
    MessageText, 
    SendButton, 
    SendMessageForm 
} from './ChatBoxStyle';

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
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                username: userNames[doc.data().userUid] || 'Customer',
                timestamp: doc.data().timestamp.toDate(),
            })).filter(message => {
                return (
                    message.userUid === userUid || // Messages sent by the current user
                    (message.sender === 'admin' && message.recipient === userUid) // Messages sent by admin to the current user
                );
            });

            console.log('Fetched Messages:', fetchedMessages);
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
                recipient: "admin",
                senderType: 'customer',
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
        <ChatContainer>
            <HeadingOfChatBox>Chat With Us!</HeadingOfChatBox>

            <MessageListChat>
                {messages.map((message) => (
                    <MessageItem 
                        key={message.id} 
                        isUser={message.userUid === userUid} 
                        isAdmin={message.sender === 'admin'}
                    >
                        <MessageInfo isUser={message.userUid === userUid}>
                            <strong>
                                {message.sender === 'admin' 
                                    ? 'Admin' 
                                    : message.userUid === userUid 
                                    ? 'You' 
                                    : message.username}
                            </strong>
                            <span style={{ marginLeft: '10px' }}>{formatDate(message.timestamp)}</span>
                        </MessageInfo>
                        <MessageText isUser={message.userUid === userUid} isAdmin={message.sender === 'admin'}>
                            {message.text}
                        </MessageText>
                    </MessageItem>
                ))}
            </MessageListChat>
            <SendMessageForm onSubmit={handleSendMessage}>
                <MessageInput
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <SendButton type="submit">Send</SendButton>
            </SendMessageForm>
        </ChatContainer>
    );
};

export default ChatBox;
