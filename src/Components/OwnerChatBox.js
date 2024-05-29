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
            const q = query(collection(db, 'messages'), where('recipient', '==', 'admin'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const chats = snapshot.docs.reduce((acc, doc) => {
                    const message = doc.data();
                    const existingChat = acc.find(chat => chat.userUid === message.userUid);
                    if (!existingChat) {
                        acc.push({ userUid: message.userUid, username: '' }); // Initialize username as empty string
                    }
                    return acc;
                }, []);

                setChatList(chats);
            });

            return () => {
                unsubscribe();
            };
        };

        fetchChatList();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                const q = query(
                    collection(db, 'messages'),
                    where('userUid', '==', selectedChat.userUid),
                    orderBy('timestamp', 'asc')
                );
    
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedMessages = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        timestamp: doc.data().timestamp.toDate(),
                    }));
                    console.log("Fetched messages:", fetchedMessages);
                    setMessages(fetchedMessages);
                });

                return () => {
                    unsubscribe();
                };
            }
        };

        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        const fetchCustomerName = async () => {
            if (selectedChat) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', selectedChat.userUid));
                    const username = userDoc.exists() ? userDoc.data().name : 'Customer';

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
            console.log("Sending message:", newMessage); 
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                recipient: selectedChat.userUid,
                senderType: 'admin',
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
        <>
        <HeadingChatOwner>Customer's Enquiries</HeadingChatOwner>
        <ChatContainerOwner>
            <ChatListOwner>
                {chatList.map(chat => (
                    <ChatListItemOwner key={chat.userUid} onClick={() => setSelectedChat(chat)}
                    isActive={selectedChat && selectedChat.userUid === chat.userUid}>
                        <p>{chat.username || 'Customer'}</p>
                    </ChatListItemOwner>
                ))}
            </ChatListOwner>
            {selectedChat && (
                <ChatWindowOwner>
                    <MessageListOwner>
                        {messages.map(message => (
                            <MessageItemOwner key={message.id} isUser={message.senderType !== 'admin'}>
                                <p>{formatDate(message.timestamp)}</p>
                                <p><strong>{message.senderType === 'admin' ? 'You' : chatList.find(chat => chat.userUid === selectedChat.userUid)?.username || 'Customer'}:</strong>
                                 {message.text}</p>
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
        </>
    );
};

export default OwnerChatBox;
