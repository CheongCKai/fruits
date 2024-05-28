import styled from 'styled-components';

export const ChatContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  padding: 30px 70px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const HeadingOfChatBox = styled.h2`
  text-align: center;
  color: #333;
`;

export const MessageListChat = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: scroll;
  
`;

export const MessageItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #eee;
  background-color: ${({ isUser }) => (isUser ? '#ccffcc' : '#f0f0f0')};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const MessageInfo = styled.div`
  margin-bottom: 5px;
  font-size: 0.85em;
  color: #666;
  color: ${({ isUser }) => (isUser ? '#333' : '#000')};
`;

export const MessageText = styled.div`
  max-width: 80%;
  word-wrap: break-word;
  text-align: ${({ isUser }) => (isUser ? 'right' : 'left')};
`;

export const SendMessageForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 5px;
`;
