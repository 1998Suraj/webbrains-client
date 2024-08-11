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
import { jwtDecode } from "jwt-decode";

const LikedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const token = localStorage.getItem("jwtToken");
  const user = jwtDecode(token);

  const getLikeBlogData = async () => {
    setLoading(true);
    try {
      const likeData = await apiService.get(`users/liked-posts/${user.id}`);
      setPosts(likeData?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch liked posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLikeBlogData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ marginBottom: 3, textAlign: "center" }}
      >
        Your Liked Blogs
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
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

export default LikedPosts;
