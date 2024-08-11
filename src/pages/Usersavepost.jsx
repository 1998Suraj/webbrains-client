import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import apiService from "../service/https";
import {jwtDecode} from "jwt-decode";

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const user = jwtDecode(token);

  const getSavedBlogData = async () => {
    try {
      const savedData = await apiService.get(`users/saved-posts/${user.id}`);
      setPosts(savedData?.data);
    } catch (err) {
      console.error("Error fetching saved posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedBlogData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ marginBottom: 3, textAlign: "center" }}
      >
        Your Saved Blogs
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={8} md={8} lg={8} key={post._id}>
              <Card
                sx={{ display: "flex", alignItems: "center", margin: "auto" }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginTop: 1, marginBottom: 2 }}
                  >
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SavedPosts;
