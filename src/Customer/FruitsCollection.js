import React from 'react';
import styled from 'styled-components';
import { StyledTableFruit, TableContainer, TableTitle } from './CustomerStyle';


const FruitSelection = ({ fruits }) => {
  return (
    <TableContainer>
      <TableTitle>Fruit Selection</TableTitle>
      <StyledTableFruit>
        <thead>
          <tr>
            <th>Fruit</th>
            <th>Price</th>
            <th>Import From:</th>
          </tr>
        </thead>
        <tbody>
          {fruits.map((fruit, index) => (
            <tr key={index}>
              <td>{fruit.fruits}</td>
              <td>${fruit.price}</td>
              <td>{fruit.place}</td>
            </tr>
          ))}
        </tbody>
      </StyledTableFruit>
    </TableContainer>
  );
};

export default FruitSelection;
