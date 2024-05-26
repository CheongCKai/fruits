import styled from 'styled-components';

export const NavItemOwner = styled.li`
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

export const AddFruitContainer = styled.div`
  margin-left: 10px;
  flex-direction: column;
`;

export const InputFruit = styled.input`
  padding: 6px;
  font-size: 12px;
  margin-right: 10px;
`;
export const ButtonEdit = styled.button`
  padding: 10px 20px;
  background-color: #AF8260;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #E4C59E;
  }
`;

export const ButtonSave = styled.button`
  padding: 10px 20px;
  background-color: #799351;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #ACD793;
  }
`;

export const ButtonAdd = styled.button`
  padding: 10px 20px;
  background-color: #A1DD70;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #006769;
  }
`;

export const OwnerViewCusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

export const CustomerDetailTable = styled.table`
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

export const ErrorText = styled.div`
  color: red;
  font-size: 12px;
`;

export const EditTable = styled.div`
  display: flex;
  justify-content: center;
`;

