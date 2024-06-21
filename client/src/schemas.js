import * as yup from "yup";

//const passwordRules = ;

export const addPropertySchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    image: yup.string()
      .url('Must be a valid URL')
      .matches(/\.(jpeg|jpg|gif|png)$/, 'Must be a valid image URL')
      .min(10, 'Image URL must be at least 10 characters long')
      .required('Image URL is required'),
    price: yup.number()
      .required('Price is required')
      .positive('Price must be a positive number')
      .integer('Price must be an integer'),
    address: yup.string().required('Location is required'),
    description: yup.string().required('Description is required')
  });