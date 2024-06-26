import styled from 'styled-components';

export const NavItem = styled.li`
  display: inline-block;
  margin-right: 30px;
  padding: 7px 0;
  color: ${(props) => (props.active ? "black" : "inherit")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  border-bottom: ${(props) => (props.active ? "4px solid #2DCC70" : "none")};
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
  font-size: 20px;
  &:hover {
    border-bottom: 4px solid #2dcc70;
    text-decoration: none;
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

export const TableTitle = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

export const StyledTableFruit = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin: 0 auto;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export const TotalPrice = styled.h2`
margin-top: 20px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px; 
`;

export const ButtonSubmit = styled.button`
  padding: 10px 20px;
  background-color: #238C53;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #2DCC70;
  }
`;

export const ButtonClear = styled.button`
  padding: 10px 20px;
  background-color: #FF9F66;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #FF0000;
  }
`;

export const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

export const OrderTable = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin: 0 auto;

  th, td {
    border: 4px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export const ToggleButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #2dcc70;
  color: white;
  &:hover {
    background-color: #28a745;
  }
`;


export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ContentContainer = styled.div`
  width: 100%;
`;

export const HeaderContent = styled.h1`
  text-align: center;
  margin: 0;
`;

export const ButtonSignOut = styled.button`
  position: absolute;
  right: 50px;
  padding: 10px 20px;
  background-color: #FC4100;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #FF0000;
  }
`;

//FAQ

export const FAQContainer = styled.div`
  width: 50%;              
  margin: 20px auto;       
  padding: 20px;           
  border: 1px solid #ddd;  
  border-radius: 8px;      
  background-color: #f9f9f9; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Box shadow for a slight depth effect
`;

export const FAQHeader = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const FAQItem = styled.div`
  width: 100%; 
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin-bottom: 10px;
`;


export const FAQQuestion = styled.h4`
  cursor: pointer;
  width: 70%;
  max-width: 800px;
  margin: 0;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s ease;
 
  &:hover {
    background-color: #0056b3;
  }
`;

export const FAQAnswer = styled.p`
  margin: 0;
  padding: 10px;
  background-color: #fff;
  border: 8px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  width: 70%;
  text-align: center;
  max-width: 800px;
`;