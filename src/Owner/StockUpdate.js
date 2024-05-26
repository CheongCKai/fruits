import React from "react";
import { useEffect, useState } from "react";
import { db } from "../Backend/Firebase/firebase";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import {
  StyledTableFruit,
  TableContainer,
  TableTitle,
} from "../Customer/CustomerStyle";
import {
  AddFruitContainer,
  ButtonAdd,
  ButtonEdit,
  ButtonSave,
  EditTable,
  InputFruit,
} from "./OwnerStyle";
import AddFruit from "./AddStock";

const StockUpdate = () => {
  const [fruits, setFruits] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Fruits"));
        const fruitData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFruits(fruitData);
      } catch (error) {
        console.error("Error fetching fruit data:", error);
      }
    };

    fetchFruits();
  }, []);

  // Validation function for individual fruit in edit mode
  const validateCurrentFruit = (index) => {
    const fruit = fruits[index];
    const errors = {};

    if (!fruit.fruits || !fruit.fruits.trim()) {
      errors.fruits = 'Fruit is required';
    }

    if (!fruit.price || isNaN(fruit.price)) {
      errors.price = 'Only Number';
    }

    if (!fruit.stock || isNaN(fruit.stock) || fruit.stock.length > 3) {
      errors.stock = 'Only Number';
    }

    if (!fruit.place || !/^[a-zA-Z\s]*$/.test(fruit.place)) {
      errors.place = 'Only alphabets';
    }

    return errors;
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFruits = [...fruits];
    updatedFruits[index][name] = value;
    setFruits(updatedFruits);

        // Validate the current fruit and update errors state
        const currentErrors = validateCurrentFruit(index);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [index]: currentErrors,
        }));
  };

  const handleSave = async () => {
    // Check if there are any errors from handleInputChange
    const hasEditErrors = fruits.some((fruit, index) => Object.keys(validateCurrentFruit(index)).length > 0);
    
    if (hasEditErrors) {
      console.log('Cannot save due to edit errors');
      return;
    }

    try {
      for (const fruit of fruits) {
        const fruitDoc = doc(db, "Fruits", fruit.id);
        await updateDoc(fruitDoc, {
          fruits: fruit.fruits,
          price: fruit.price,
          place: fruit.place,
        });
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error updating fruit data:", error);
    }
  };

  const handleDeleteFruit = async (id) => {
    try {
      await deleteDoc(doc(db, "Fruits", id));
      setFruits(fruits.filter((fruit) => fruit.id !== id));

    } catch (error) {
      console.error("Error deleting fruit:", error);
    }
  };

  return (
    <div>
      <TableContainer>
        <TableTitle>Fruit Selection</TableTitle>
        <StyledTableFruit>
          <thead>
            <tr>
              <th>Fruit</th>
              <th>Price</th>
              <th>Stock Available</th>
              <th>Import From:</th>
            </tr>
          </thead>
          <tbody>
            {fruits.map((fruit, index) => (
              <tr key={fruit.id}>
                <td>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="fruits"
                        value={fruit.fruits}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {errors[index]?.fruits && (
                        <div style={{ color: 'red' }}>{errors[index].fruits}</div>
                      )}
                    </>
                  ) : (
                    fruit.fruits
                  )}
                </td>
                <td>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="price"
                        value={fruit.price}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {errors[index]?.price && (
                        <div style={{ color: 'red' }}>{errors[index].price}</div>
                      )}
                    </>
                  ) : (
                    `$${fruit.price}`
                  )}
                </td>
                <td>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="stock"
                        value={fruit.stock}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {errors[index]?.stock && (
                        <div style={{ color: 'red' }}>{errors[index].stock}</div>
                      )}
                    </>
                  ) : (
                    fruit.stock
                  )}
                </td>
                <td>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="place"
                        value={fruit.place}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {errors[index]?.place && (
                        <div style={{ color: 'red' }}>{errors[index].place}</div>
                      )}
                    </>
                  ) : (
                    fruit.place
                  )}
                </td>
                {editMode && (
                  <td>
                    <button onClick={() => handleDeleteFruit(fruit.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </StyledTableFruit>
      </TableContainer>

      {editMode && (
        <AddFruitContainer>
          <h3>Add New Fruit</h3>
          <EditTable>
            <AddFruit setFruits={setFruits} fruits={fruits} />
          </EditTable>
        </AddFruitContainer>
      )}

      <br />
      <ButtonEdit onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Edit"}
      </ButtonEdit>
      {editMode && <ButtonSave onClick={handleSave}>Save</ButtonSave>}
    </div>
  );
};

export default StockUpdate;
