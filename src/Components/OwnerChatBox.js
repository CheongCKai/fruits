import React, { useState, useEffect } from 'react';
import { db } from '../Backend/Firebase/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import {
    ChatContainerOwner,
    ChatListOwner,
    ChatListItemOwner,
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
            const q = query(collection(db, 'messages'), where('senderType', '==', 'customer'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const chats = snapshot.docs.map(doc => ({
                    userUid: doc.data().userUid,
                    username: '', // Initialize username
                }));
                setChatList(chats);
            });

            return () => unsubscribe();
        };

        fetchChatList();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                const q = query(
                    collection(db, 'messages'),
                    where('recipient', '==', userUid), // Filter messages for current admin userUid
                    where('userUid', '==', selectedChat.userUid),
                    orderBy('timestamp', 'asc')
                );
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedMessages = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        timestamp: doc.data().timestamp.toDate(),
                    }));
                    setMessages(fetchedMessages);
                });

                return () => unsubscribe();
            }
        };

        fetchMessages();
    }, [selectedChat, userUid]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedChat) return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                userUid: userUid,
                recipient: selectedChat.userUid,
                senderType: 'admin',
                timestamp: new Date(),
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
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
                    <ChatListItemOwner
                        key={chat.userUid}
                        onClick={() => setSelectedChat(chat)}
                        active={selectedChat && selectedChat.userUid === chat.userUid}
                    >
                        <p>{chat.username || 'Customer'}</p>
                    </ChatListItemOwner>
                ))}
            </ChatListOwner>

            {selectedChat && (
                <ChatWindowOwner>
                    <MessageListOwner>
                        {messages.map((message) => (
                            <MessageItemOwner
                                key={message.id}
                                isUser={message.senderType === 'customer'}
                            >
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
