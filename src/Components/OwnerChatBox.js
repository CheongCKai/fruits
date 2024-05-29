import React, { useState, useEffect } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { collection, query, where, orderBy, onSnapshot, getDoc, doc, addDoc } from 'firebase/firestore';
import {
    ChatContainerOwner,
    ChatListItemOwner,
    ChatListOwner,
    ChatWindowOwner,
    HeadingChatOwner,
    MessageInputFormOwner,
    MessageInputOwner,
    MessageItemOwner,
    MessageListOwner,
    SendButtonOwnerChat
} from './OwnerChatStyle';

const OwnerChatBox = ({ userUid }) => {
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchChatList = async () => {
            console.log("Fetching chat list...");
            const q = query(collection(db, 'messages'), where('senderType', '==', 'customer'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const chats = snapshot.docs.reduce((acc, doc) => {
                    const message = doc.data();
                    const chat = acc.find(chat => chat.userUid === message.userUid);
                    if (!chat) {
                        acc.push({ userUid: message.userUid, username: '' }); // Initialize username as empty string
                        console.log("New chat added:", message.userUid);
                    }
                    return acc;
                }, []);
                setChatList(chats);
            });

            return () => {
                console.log("Unsubscribing chat list listener");
                unsubscribe();
            };
        };
        fetchChatList();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                console.log("Fetching messages for chat:", selectedChat.userUid);
                const q = query(
                    collection(db, 'messages'),
                    where('sender', 'in', ['admin', selectedChat.userUid]), // Include both admin's and customer's messages
                    where('recipient', 'in', ['admin', selectedChat.userUid]),
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
                    console.log("Messages fetched:", fetchedMessages);
                    setMessages(fetchedMessages);
                });

                return () => {
                    console.log("Unsubscribing message listener for chat:", selectedChat.userUid);
                    unsubscribe();
                };
            }
        };

        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        const fetchCustomerName = async () => {
            if (selectedChat) {
                console.log("Fetching customer name for UID:", selectedChat.userUid);
                try {
                    const userDoc = await getDoc(doc(db, 'users', selectedChat.userUid));
                    const username = userDoc.exists() ? userDoc.data().name : 'Customer';
                    console.log("Customer name fetched:", username);
                    setChatList(prevChatList => prevChatList.map(chat => (
                        chat.userUid === selectedChat.userUid ? { ...chat, username: username } : chat
                    )));
                } catch (error) {
                    console.error('Error fetching customer name:', error);
                }
            }
        };

        fetchCustomerName();
    }, [selectedChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedChat) {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                recipient: selectedChat.userUid,
                sender: 'admin',
                timestamp: new Date(),
                userUid: selectedChat.userUid,
            });
            setNewMessage('');
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
                {chatList.map(chat => (
                    <ChatListItemOwner key={chat.userUid} onClick={() => setSelectedChat(chat)}>
                        <p>{chat.username || 'Customer'}</p>
                    </ChatListItemOwner>
                ))}
            </ChatListOwner>
            {selectedChat && (
                <ChatWindowOwner>
                    <MessageListOwner>
                        {messages.map(message => (
                            <MessageItemOwner key={message.id} isUser={message.sender === 'admin'}>
                                <p>{formatDate(message.timestamp)}</p>
                                <p><strong>{message.sender === 'admin' ? 'You' : chatList.find(chat => chat.userUid === selectedChat.userUid)?.username || 'Customer'}:</strong> {message.text}</p>
                                
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
