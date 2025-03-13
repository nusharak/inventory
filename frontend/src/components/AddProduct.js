import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid2, Typography,Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import axios from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validationSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  stock:Yup.number()
  .required('Stock is required')
  .integer('Stock must be an integer')
  .positive('Stock must be a positive number'),
  image: Yup.mixed().required('Image is required'),
});

const AddProductPage = () => {
  const { product_id } = useParams();
  const [isEdit,setIsEdit] = useState(false)
  const [initialData,setInitialData] = useState({})

  const fetchEditData = () => {
    if (product_id) {
      axios.get(`/product/${product_id}`)
        .then((res) => {
          if (res.status === 200) {
            setInitialData(res.data.data);  
            setIsEdit(true); 
          }
        })
        .catch((err) => {
          console.log(err, 'error');
        })
    }
  };
  useEffect(()=>{
    fetchEditData()
  },[product_id])

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('stock', isNaN(parseInt(values.stock)) ? 0 : parseInt(values.stock));
    formData.append('image', values.image);
    try {
      let response;
  
      if (product_id) {
        response = await axios.put(`/product/${product_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/add-product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
  
      if (response.status === 200) {
        setInitialData({})
        setIsEdit(false)
        toast.success(product_id ? 'Product updated successfully' : 'Product added successfully');
        window.history.back();
      } else {
        toast.error(product_id ? 'Error updating product' : 'Error adding product');
      }
  
      resetForm();
    } catch (error) {
      toast.error(product_id ? 'Error updating product' : 'Error adding product');
    }
  };
  return (
    <Box sx={{ padding: 3, marginLeft: { xs: 0, md: '250px', sm: '250px' } }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
     { isEdit ? 'Edit Product' : 'Add Product '} 
    </Typography>
    <Formik
      initialValues={{
        name: isEdit ? initialData?.name : '',
        description: isEdit ? initialData?.description : '',
        price: isEdit ? initialData?.price : '',
        stock: isEdit ? initialData?.stock : '',
        image:  isEdit ? initialData?.image : null,
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, errors, touched }) => (
        <Form>
          <Grid2 container spacing={3 } direction="column"> 
            <Grid2 item xs={12}>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Product Name"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
               <Field
                as={TextField}
                name="description"
                label="Description"
                multiline
                fullWidth
                  minRows={3}
                  maxRows={7}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <Field
                as={TextField}
                fullWidth
                name="price"
                label="Price"
                type="number"
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                inputProps={{
                  step: "0.01",
                }}
              />
              <Field
                as={TextField}
                fullWidth
                name="stock"
                label="Stock"
                type="number"
                error={touched.stock && !!errors.stock}
                helperText={touched.stock && errors.stock}
                inputProps={{
                  pattern: "[0-9]*", 
                  max: "999999999", 
                  min: "0"
                }}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ marginTop: 1 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFieldValue('image', e.target.files[0])}
                  accept="image/*"
                />
              </Button>
              {errors.image && touched.image && (
                <Typography color="error" variant="body2">
                  {errors.image}
                </Typography>
              )}
            </Grid2>
            <Grid2 item xs={12} sx={{ display: 'flex', gap: 2 ,justifyContent:'flex-end'}}>
                <Button size='small' type="submit" variant="contained" fullWidth>
                  {isEdit ? 'Save Changes' : 'Add Product'}
                </Button>
                <Button size='small' onClick={() => { window.history.back(); }} color="error" variant="outlined" fullWidth>
                  Cancel
                </Button>
              </Grid2>
          </Grid2>
        </Form>
      )}
    </Formik>
    <ToastContainer />
  </Box>
  );
};

export default AddProductPage;
