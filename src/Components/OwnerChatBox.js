import React, { useState, useEffect } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { ChatContainerOwner, ChatListItemOwner, ChatListOwner, ChatWindowOwner, HeadingChatOwner, MessageInputFormOwner, MessageInputOwner, MessageItemOwner, MessageListOwner, SendButtonOwnerChat } from './OwnerChatStyle';


const OwnerChatBox = ({ userUid }) => {
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Fetch chat sessions initiated by customers
    useEffect(() => {
        const fetchChatList = async () => {
            const q = query(collection(db, 'messages'), where('senderType', '==', 'customer'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const chats = snapshot.docs.reduce((acc, doc) => {
                    const message = doc.data();
                    const chat = acc.find(chat => chat.userUid === message.userUid);
                    if (!chat) {
                        acc.push({ userUid: message.userUid });
                    }
                    return acc;
                }, []);
                setChatList(chats);
            });

            return () => unsubscribe();
        };

        fetchChatList();
    }, []);

    // Fetch customer's name when a chat session is selected
    useEffect(() => {
        const fetchCustomerName = async () => {
            if (selectedChat) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', selectedChat.userUid));
                    const username = userDoc.exists() ? userDoc.data().name : 'Customer';
                    setSelectedChat(prev => ({ ...prev, username: username }));
                } catch (error) {
                    console.error('Error fetching customer name:', error);
                }
            }
        };

        fetchCustomerName();
    }, [selectedChat]);

    // Fetch messages for the selected chat session
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                const q = query(
                    collection(db, 'messages'),
                    where('recipient', '==', 'admin'),
                    where('userUid', '==', selectedChat.userUid),
                    orderBy('timestamp', 'asc')
                );
                const unsubscribe = onSnapshot(q, async (snapshot) => {
                    const fetchedMessages = await Promise.all(snapshot.docs.map(async (doc) => {
                        const messageData = doc.data();
                        return {
                            id: doc.id,
                            ...messageData,
                            timestamp: messageData.timestamp.toDate(),
                        };
                    }));
                    setMessages(fetchedMessages);
                });

                return () => unsubscribe();
            }
        };

        fetchMessages();
    }, [selectedChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            const docRef = await addDoc(collection(db, 'messages'), {
                text: newMessage,
                userUid: userUid,
                recipient: selectedChat.userUid,
                senderType: 'admin',
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
        <ChatContainerOwner>
            <HeadingChatOwner>Customer's Enquiries</HeadingChatOwner>
            <ChatListOwner>
                {chatList.map((chat) => (
                    <ChatListItemOwner key={chat.userUid} onClick={() => setSelectedChat(chat)}>
                        {chat.username || 'Customer'}
                    </ChatListItemOwner>
                ))}
            </ChatListOwner>
            {selectedChat && (
                <ChatWindowOwner>
                    <MessageListOwner>
                        {messages.map((message) => (
                            <MessageItemOwner key={message.id} isUser={message.senderType === 'customer'}>
                                <div>
                                    <strong>{message.senderType === 'customer' ? selectedChat.username : 'You'}</strong>
                                    <span style={{ marginLeft: '10px' }}>{formatDate(message.timestamp)}</span>
                                </div>
                                <div>{message.text}</div>
                            </MessageItemOwner>
                        ))}
                    </MessageListOwner>
                    <MessageInputFormOwner onSubmit={handleSendMessage}>
                        <MessageInputOwner
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <SendButtonOwnerChat type="submit">Send</SendButtonOwnerChat>
                    </MessageInputFormOwner>
                </ChatWindowOwner>
            )}
        </ChatContainerOwner>
    );
};

export default OwnerChatBox;