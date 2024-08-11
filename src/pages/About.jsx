import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import { Favorite, Bookmark, VerifiedUser } from '@mui/icons-material';

const About = () => {
  const user = useSelector(state => state?.User);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#8E44AD', marginRight: 2 }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                {user?.username || 'Unknown User'}
              </Typography>
            </Box>
            {user?.isAdmin && (
              <Chip
                label="Admin"
                color="primary"
                icon={<VerifiedUser />}
                sx={{ marginLeft: 2 }}
              />
            )}
          </Box>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {user?.email || 'No email provided'}
          </Typography>
          <Chip
            label={user?.isApproved || 'Unknown'}
            color={user?.isApproved === 'Approved' ? 'success' : 'warning'}
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="body2" color="textSecondary">
            Status: {user?.isActive ? 'Active' : 'Inactive'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
                <b>User Type : {user?.isAdmin ? 'Admin' : 'User'}</b>
              </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Favorite sx={{ color: 'red', marginRight: 1 }} />
            <Typography variant="body2">
              {user?.likedPosts?.length || 0} Liked Posts
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Bookmark sx={{ color: 'blue', marginRight: 1 }} />
            <Typography variant="body2">
              {user?.savedPosts?.length || 0} Saved Posts
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;
