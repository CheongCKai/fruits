import styled from 'styled-components';

export const ChatContainerOwner = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const ChatListOwner = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: scroll;
`;

export const ChatListItemOwner = styled.li`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #f9f9f9;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const ChatWindowOwner = styled.div`
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;

export const MessageListOwner = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: scroll;
`;

export const MessageItemOwner  = styled.li`
  margin-bottom: 10px;
  padding: 5px 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: ${({ isUser }) => (isUser ? '#ccffcc' : '#f0f0f0')};
  display: flex;
  flex-direction: column;
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

export const MessageInputFormOwner  = styled.form`
  display: flex;
  margin-top: 10px;
`;

export const MessageInputOwner  = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

export const SendButtonOwnerChat  = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export const HeadingChatOwner = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;
