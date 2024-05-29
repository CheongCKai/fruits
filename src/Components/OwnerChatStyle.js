import styled from 'styled-components';

export const ChatContainerOwner = styled.div`
  max-width: 800px;
  height: 550px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
`;

export const ChatListOwner = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: scroll;
  flex: 1; 
  padding-right: 10px;
  border-right: 1px solid #ddd;
`;

export const ChatListItemOwner = styled.li`
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? '#ACD793' : '#f9f9f9')};

  &:hover {
    background-color: #ACD793;
  }
`;

export const ChatWindowOwner = styled.div`
  flex: 3;
  border-top: 1px solid #ddd;
  padding-top: 20px;
  padding-left: 40px;
`;

export const MessageListOwner = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 400px;
  overflow-y: scroll;
  flex: 1; 
`;

export const MessageItemOwner  = styled.li`
  margin-bottom: 10px;
  padding: 1px 6px;
  //border: 1px solid #eee;
  border-radius: 8px;
  background-color: ${({ isUser }) => (isUser ? '#f0f0f0' : '#ccffcc')};
  //display: flex;
  flex-direction: column;
  // align-items: ${({ isUser }) => (isUser ? 'flex-start' : 'flex-end')};
  text-align: ${({ isUser }) => (isUser ? 'left' : 'right')};
  max-width: 95%;
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

export const MessagetextOwner = styled.div`
padding: 8px;
border-radius: 8px;  
word-wrap: break-word;
border: 1px solid #eee;
background-color: ${(props) => (props.isAdmin ? '#006769' : '#AF8F6F')};
color: ${(props) => (props.isAdmin ? 'white' : 'black')};
`;

