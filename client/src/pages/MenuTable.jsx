import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const MenuTable = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    
    fetch('/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error fetching menu items:', error));
  }, []);

  const handleAddItem = (values, { resetForm }) => {
    const newItem = {
      id: menuItems.length + 1,
      name: values.newItemName,
      price: parseFloat(values.newItemPrice),
      description: values.newItemDescription,
      image: values.newItemImage,
    };

    setMenuItems([...menuItems, newItem]);


    resetForm();
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedItems);
    //  DELETE request to API to delete the item
  };

  return (
    <div className="menu-table">
      <h1 className="menu-header">Menu Table</h1>

      <Formik
        initialValues={{
          newItemName: '',
          newItemPrice: '',
          newItemDescription: '',
          newItemImage: '',
        }}
        validate={values => {
          const errors = {};
          
          if (!values.newItemName) {
            errors.newItemName = 'Required';
          }
          if (!values.newItemPrice) {
            errors.newItemPrice = 'Required';
          }
          return errors;
        }}
        onSubmit={handleAddItem}
      >
        {({ errors }) => (
          <Form>
            <label htmlFor="newItemName">Name:</label>
            <Field
              type="text"
              id="newItemName"
              name="newItemName"
              required
            />
            <ErrorMessage name="newItemName" component="div" />

            <label htmlFor="newItemPrice">Price:</label>
            <Field
              type="number"
              id="newItemPrice"
              name="newItemPrice"
              step="0.01"
              required
            />
            <ErrorMessage name="newItemPrice" component="div" />

            <label htmlFor="newItemDescription">Description:</label>
            <Field
              type="text"
              id="newItemDescription"
              name="newItemDescription"
              required
            />
            <ErrorMessage name="newItemDescription" component="div" />

            <label htmlFor="newItemImage">Image URL:</label>
            <Field
              type="text"
              id="newItemImage"
              name="newItemImage"
            />

            <button type="submit" className="add-button">Add Item</button>
          </Form>
        )}
      </Formik>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.description}</td>
              <td>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100px' }} />
                )}
              </td>
              <td>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuTable;





