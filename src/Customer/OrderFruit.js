import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../Backend/Firebase/firebase';
import { addDoc, collection, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { ButtonClear, ButtonReset, ButtonSubmit, ButtonsContainer, StyledTableFruit, TableContainer, TableTitle, TotalPrice } from './CustomerStyle';

const OrderFruit = ({ fruits, userUid }) => {
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

  //update the stock after customer purchase
  const handleStockUpdate = async () => {
    try {
      await Promise.all(fruits.map(async (fruit) => {
        const quantity = selectedQuantities[fruit.id] || 0;
        const newStock = fruit.stock - quantity;

        const fruitRef = doc(db, 'Fruits', fruit.id);
        await updateDoc(fruitRef, { stock: newStock });
      }));
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error; // Rethrow error to handle it in the handleSubmit function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update stock first
      await handleStockUpdate();

      // Prepare order data
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
        customerUid: userUid,
      };

      await addDoc(collection(db, 'Orders'), orderData);

      // Clear local state and storage
      setSelectedQuantities({});
      localStorage.removeItem('selectedQuantities');
      window.location.reload();
      alert("Order submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting order: ", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedQuantities', JSON.stringify(selectedQuantities));
  }, [selectedQuantities]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('selectedQuantities');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const resetQuantities = () => {
    const resetState = fruits.reduce((acc, fruit) => {
      acc[fruit.id] = 0;
      return acc;
    }, {});
    setSelectedQuantities(resetState);
    localStorage.setItem('selectedQuantities', JSON.stringify(resetState));
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

export default OrderFruit;
