import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import apiService from '../service/https';

const BlogCreationForm = () => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm();
  const [loading ,  setLoading] = useState();

  const onSubmit = async(data) => {
    try{
      setLoading(true);

      const blog = await apiService.post('/posts/add-blog',{title : data?.title , content : data?.content})
      toast.success('Blog created successfully')
      reset();
    }catch(err){
      toast.error(err.message || "something went worng")
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create New Blog
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Blog Title is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Blog Title"
                variant="outlined"
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ''}
                sx={{ marginBottom: 2 }}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            defaultValue=""
            rules={{ required: 'Blog Content is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Blog Content"
                variant="outlined"
                multiline
                rows={6}
                error={!!errors.content}
                helperText={errors.content ? errors.content.message : ''}
                sx={{ marginBottom: 3 }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: 2 }}
            disabled={loading}
          >
            Create Blog
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default BlogCreationForm;
