import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid2, Typography,Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import axios from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  email: Yup.string().required('Email is required').email(),
  // image: Yup.mixed().required('Image is required'),
});

const AddCustomerPage = () => {
  const { customer_id } = useParams();
  const [isEdit,setIsEdit] = useState(false)
  const [initialData,setInitialData] = useState({})

  const fetchEditData = () => {
    if (customer_id) {
      axios.get(`/customer/${customer_id}`)
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
  },[customer_id])

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
    formData.append('email', values.email);
    formData.append('image', values.image);
    try {
      let response;
  
      if (customer_id) {
        response = await axios.put(`/customer/${customer_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/add-customer', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
  
      if (response.status === 200) {
        setInitialData({})
        setIsEdit(false)
        toast.success(customer_id ? 'Customer updated successfully' : 'Customer added successfully');
        window.history.back();
      } else {
        toast.error(customer_id ? 'Error updating Customer' : 'Error adding Customer');
      }
  
      resetForm();
    } catch (error) {
      toast.error(customer_id ? 'Error updating Customer' : 'Error adding Customer');
    }  
  };
  return (
    <Box sx={{ padding: 3, marginLeft: { xs: 0, md: '250px', sm: '250px' } }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
     { isEdit ? 'Edit Customer' : 'Add Customer '} 
    </Typography>
    <Formik
      initialValues={{
        first_name: isEdit ? initialData?.first_name : '',
        last_name: isEdit ? initialData?.last_name : '',
        email: isEdit ? initialData?.email : '',
        image:  isEdit ? initialData?.profile_pic : null,
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
                name="first_name"
                label="First Name"
                error={touched.first_name && !!errors.first_name}
                sx={{ marginTop: 1 }}
                helperText={touched.first_name && errors.first_name}
              />
               <Field
                as={TextField}
                fullWidth
                name="last_name"
                label="Last Name"
                sx={{ marginTop: 1 }}
                error={touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
            <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
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
            <Grid2 item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
  <Button size="small" type="submit" variant="contained" sx={{ width: 'auto' }}>
    {isEdit ? 'Save Changes' : 'Add Customer'}
  </Button>
  <Button size="small" onClick={() => { window.history.back(); }} color="error" variant="outlined" sx={{ width: 'auto' }}>
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

export default AddCustomerPage;
