import React, { useState } from 'react';
import api from '../api'; 
import { InputFruit, ButtonAdd } from './OwnerStyle';

const AddFruit = ({ setFruits, fruits }) => {
  const [newFruit, setNewFruit] = useState({
    fruits: '',
    price: '',
    stock: '',
    place: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFruit({ ...newFruit, [name]: value });
  };

  const validateFruit = () => {
    let valid = true;
    const errors = {};

    if (!newFruit.fruits || !newFruit.fruits.trim()) {
      errors.fruits = 'Fruit is required';
      valid = false;
    }

    if (!newFruit.price || isNaN(newFruit.price)) {
      errors.price = 'Only Number';
      valid = false;
    }

    if (!newFruit.stock || isNaN(newFruit.stock) || newFruit.stock.length > 3) {
      errors.stock = 'Only Number';
      valid = false;
    }

    if (!newFruit.place || !/^[a-zA-Z\s]*$/.test(newFruit.place)) {
      errors.place = 'Only alphabets';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleAddFruit = async () => {
    if (!validateFruit()) {
      return;
    }
    try {
      const response = await api.post('/fruits', newFruit);
      const updatedFruits = [...fruits, { id: response.data.id, ...newFruit }];
      setFruits(updatedFruits);
      setNewFruit({ fruits: '', price: '', stock: '', place: '' });
    } catch (error) {
      console.error('Error adding fruit:', error);
    }
  };

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <InputFruit
              type="text"
              placeholder="Fruit"
              name="fruits"
              value={newFruit.fruits}
              onChange={handleChange}
            />
            {errors.fruits && <div style={{ color: 'red' }}>{errors.fruits}</div>}
          </td>
          <td>
            <InputFruit
              type="text"
              placeholder="Price"
              name="price"
              value={newFruit.price}
              onChange={handleChange}
            />
            {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
          </td>
          <td>
            <InputFruit
              type="text"
              placeholder="Stock Available"
              name="stock"
              value={newFruit.stock}
              onChange={handleChange}
            />
            {errors.stock && <div style={{ color: 'red' }}>{errors.stock}</div>}
          </td>
          <td>
            <InputFruit
              type="text"
              placeholder="Import From"
              name="place"
              value={newFruit.place}
              onChange={handleChange}
            />
            {errors.place && <div style={{ color: 'red' }}>{errors.place}</div>}
          </td>
          <td>
            <ButtonAdd onClick={handleAddFruit}>Add</ButtonAdd>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default AddFruit;