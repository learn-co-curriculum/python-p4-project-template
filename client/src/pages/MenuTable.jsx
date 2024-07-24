import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../index.css";
import Navbar from "../components/Navbar/NavBar";

const MenuTable = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetch("https://menu-qdlu.onrender.com/menu")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched menu items:", data);
        const formattedData = data.map(item => ({
          ...item,
          price: item.price !== undefined ? item.price : 0,
        }));
        setMenuItems(formattedData);
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  const handleAddItem = (values, { resetForm }) => {
    const newItem = {
      name: values.newItemName,
      price: parseFloat(values.newItemPrice),
      description: values.newItemDescription,
      image: values.newItemImage,
    };

    console.log("Adding new item:", newItem);
    fetch("https://menu-qdlu.onrender.com/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Added item:", data);
        setMenuItems([...menuItems, data]);
        resetForm();
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const handleEditItem = (item) => {
    setEditItem(item);
  };

  const handleUpdateItem = (values, { resetForm }) => {
    const updatedItem = {
      name: values.newItemName,
      price: parseFloat(values.newItemPrice),
      description: values.newItemDescription,
      image: values.newItemImage,
    };

    console.log("Updating item with ID:", editItem.id);
    fetch(`https://menu-qdlu.onrender.com/menu/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated item:", data);
        const updatedItems = menuItems.map((item) =>
          item.id === editItem.id ? data : item
        );
        setMenuItems(updatedItems);
        setEditItem(null);
        resetForm();
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const handleDeleteItem = (itemId) => {
    console.log("Deleting item with ID:", itemId);
    fetch(`https://menu-qdlu.onrender.com/menu/${itemId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Item deleted successfully", response);
        setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div>
      <Navbar />
      <div className="menu-table">
        <h1 className="menu-header">Menu Table</h1>

        {editItem ? (
          <Formik
            initialValues={{
              newItemName: editItem.name,
              newItemPrice: editItem.price,
              newItemDescription: editItem.description,
              newItemImage: editItem.image,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.newItemName) {
                errors.newItemName = "Required";
              }
              if (!values.newItemPrice || values.newItemPrice <= 0) {
                errors.newItemPrice = "Must be a positive number";
              }
              return errors;
            }}
            onSubmit={handleUpdateItem}
          >
            {({ errors }) => (
              <Form>
                <label htmlFor="newItemName">Name:</label>
                <Field type="text" id="newItemName" name="newItemName" required />
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
                <Field type="text" id="newItemDescription" name="newItemDescription" required />
                <ErrorMessage name="newItemDescription" component="div" />

                <label htmlFor="newItemImage">Image URL:</label>
                <Field type="text" id="newItemImage" name="newItemImage" />

                <button type="submit" className="add-button">
                  Update Item
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              newItemName: "",
              newItemPrice: "",
              newItemDescription: "",
              newItemImage: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.newItemName) {
                errors.newItemName = "Required";
              }
              if (!values.newItemPrice || values.newItemPrice <= 0) {
                errors.newItemPrice = "Must be a positive number";
              }
              return errors;
            }}
            onSubmit={handleAddItem}
          >
            {({ errors }) => (
              <Form>
                <label htmlFor="newItemName">Name:</label>
                <Field type="text" id="newItemName" name="newItemName" required />
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
                <Field type="text" id="newItemDescription" name="newItemDescription" required />
                <ErrorMessage name="newItemDescription" component="div" />

                <label htmlFor="newItemImage">Image URL:</label>
                <Field type="text" id="newItemImage" name="newItemImage" />

                <button type="submit" className="add-button">
                  Add Item
                </button>
              </Form>
            )}
          </Formik>
        )}

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
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price !== undefined ? item.price.toFixed(2) : 'N/A'}</td>
                <td>{item.description}</td>
                <td>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEditItem(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;

