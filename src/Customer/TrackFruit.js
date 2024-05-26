import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../Backend/Firebase/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ButtonClear, ButtonReset, ButtonSubmit, ButtonsContainer, StyledTableFruit, TableContainer, TableTitle, TotalPrice } from './CustomerStyle';

const TrackFruit = ({ fruits }) => {
  const initialSelectedQuantities = JSON.parse(localStorage.getItem('selectedQuantities')) || {};
  const [selectedQuantities, setSelectedQuantities] = useState(initialSelectedQuantities);

  const handleQuantityChange = (fruitId, stock, value) => {
    const quantity = Math.max(0, Math.min(stock, parseInt(value) || 0));
    setSelectedQuantities(prev => ({ ...prev, [fruitId]: quantity }));
  };

  const totalPrice = fruits.reduce((total, fruit) => {
    const quantity = selectedQuantities[fruit.id] || 0;
    return total + quantity * fruit.price;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = fruits.map(fruit => ({
      fruit: fruit.fruits,
      price: fruit.price,
      quantity: selectedQuantities[fruit.id] || 0,
    })).filter(item => item.quantity > 0);

    const orderData = {
      order,
      purchasedate: Timestamp.fromDate(new Date()),
      totalCost: totalPrice,
      status: "Not Completed",
    };

    try {
      await addDoc(collection(db, 'Orders'), orderData);
      alert("Order submitted successfully!");
      setSelectedQuantities({});
      localStorage.removeItem('selectedQuantities'); // Clear local storage
    } catch (error) {
      console.error("Error submitting order: ", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  useEffect(() => {
    // Save selectedQuantities to localStorage whenever it changes so
    //go to other activecomponet will not change anything unless reload
    localStorage.setItem('selectedQuantities', JSON.stringify(selectedQuantities));
  }, [selectedQuantities]);

  
  useEffect(() => {
    // Clear localStorage when the page is refreshed or unloaded
    const handleUnload = () => {
      localStorage.removeItem('selectedQuantities');
    };

    window.addEventListener('beforeunload', handleUnload);

    // Cleanup the event listener on component unmount, reset it 
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const resetQuantities = () => {
    const resetState = fruits.reduce((acc, fruit) => {
      acc[fruit.id] = 0; // Set each quantity to 0
      return acc;
    }, {});
    setSelectedQuantities(resetState);
    localStorage.setItem('selectedQuantities', JSON.stringify(resetState)); // Update localStorage
  };

  return (
    <TableContainer>
      <TableTitle>Track Your Fruits</TableTitle>
      <StyledTableFruit>
        <thead>
          <tr>
            <th>Fruit</th>
            <th>Price</th>
            <th>Available Stock</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {fruits.map((fruit) => (
            <tr key={fruit.id}>
              <td>{fruit.fruits}</td>
              <td>${fruit.price}</td>
              <td>{fruit.stock}</td>
              <td>
                <input
                  type="number"
                  value={selectedQuantities[fruit.id] || 0}
                  onChange={(e) => handleQuantityChange(fruit.id, fruit.stock, e.target.value)}
                  min="0"
                  max={fruit.stock}
                />
              </td>
              <td>${(selectedQuantities[fruit.id] || 0) * fruit.price}</td>
            </tr>
          ))}
        </tbody>
      </StyledTableFruit>
      <TotalPrice>Total Price: ${totalPrice}</TotalPrice>
      
      <ButtonsContainer>
      <ButtonClear onClick={resetQuantities}>Clear</ButtonClear>
      <ButtonSubmit onClick={handleSubmit}>Order</ButtonSubmit>
      </ButtonsContainer>

    </TableContainer>
  );
};

export default TrackFruit;
