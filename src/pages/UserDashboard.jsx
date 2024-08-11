import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import apiService from "../service/https";
import moment from "moment";

const UserDashboard = () => {
  const reduxDispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state) => state.User);

  const getBlogs = async (pageToLoad) => {
    try {
      setLoading((prev) => ({ ...prev, loadingMore: true }));
      const response = await apiService.get(
        `/posts/get-all-blogs?page=${pageToLoad}`
      );
      const fetchedBlogs = response?.data?.blogPosts?.map((item) => ({
        ...item,
        like: item.likes.includes(user?._id),
        save: item.saves.includes(user?._id),
      }));

      setBlogs((prevBlogs) => {
        const existingBlogIds = new Set(prevBlogs.map((blog) => blog._id));
        const uniqueBlogs = fetchedBlogs.filter(
          (blog) => !existingBlogIds.has(blog._id)
        );
        return [...prevBlogs, ...uniqueBlogs];
      });

      setPage(response?.data?.page);
      setTotalPages(response?.data?.totalPages);
      setLoading((prev) => ({ ...prev, loadingMore: false }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      setLoading((prev) => ({ ...prev, loadingMore: false }));
    }
  };

  useEffect(() => {
    getBlogs(1);
  }, []);

  const handleLike = async (data) => {
    let id = data?._id;

    try {
      setLoading((prev) => ({ ...prev, [`like-${id}`]: true }));

      if (data.like) {
        await apiService.post(`/users/unlike/${user._id}/${id}`);
      } else {
        await apiService.post(`/users/like/${user._id}/${id}`);
      }

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id
            ? {
                ...blog,
                like: !blog.like,
                likes: blog.like
                  ? blog.likes.filter((likeId) => likeId !== user._id)
                  : [...blog.likes, user._id],
              }
            : blog
        )
      );
    } catch (err) {
      toast.error(err.message || "Unable to like/unlike");
      getBlogs(page);
    } finally {
      setLoading((prev) => ({ ...prev, [`like-${id}`]: false }));
    }
  };

  const handleSave = async (data) => {
    let id = data?._id;

    try {
      setLoading((prev) => ({ ...prev, [`save-${id}`]: true }));

      if (data.save) {
        await apiService.post(`/users/unsave/${user._id}/${id}`);
      } else {
        await apiService.post(`/users/save/${user._id}/${id}`);
      }

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id
            ? {
                ...blog,
                save: !blog.save,
                saves: blog.save
                  ? blog.saves.filter((saveId) => saveId !== user._id)
                  : [...blog.saves, user._id],
              }
            : blog
        )
      );

      toast.success(
        blogs.find((blog) => blog._id === id)?.save
          ? "Removed from saved"
          : "Saved"
      );
    } catch (err) {
      toast.error(err.message || "Unable to save/unsave");
      getBlogs(page);
    } finally {
      setLoading((prev) => ({ ...prev, [`save-${id}`]: false }));
    }
  };

  const loadMoreBlogs = async () => {
    if (page < totalPages) {
      await getBlogs(page + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2 &&
        !loading.loadingMore
      ) {
        loadMoreBlogs();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading.loadingMore, page, totalPages]);

  return (
    <Box p={2} sx={{ maxWidth: "70vw", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>
      {blogs.map((blog) => (
        <Card key={blog._id} sx={{ marginBottom: 6 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {blog.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {blog.content}
            </Typography>
          </CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Blog Added: {moment(blog.createdAt).format("MMMM Do YYYY, h:mm a")}
            </Typography>
            <Box display="flex" justifyContent="right">
              <IconButton
                onClick={() => handleLike(blog)}
                sx={{
                  color: blog.like ? "#ed4956" : "default",
                  display: "flex",
                  alignItems: "center",
                }}
                disabled={loading[`like-${blog._id}`]}
              >
                {loading[`like-${blog._id}`] ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "black",
                        fontSize: "0.875rem",
                        marginRight: "4px",
                      }}
                    >
                      {blog.likes.length}
                    </Typography>
                    {blog.like ? <Favorite /> : <FavoriteBorder />}
                  </>
                )}
              </IconButton>
              <IconButton
                onClick={() => handleSave(blog)}
                sx={{
                  color: blog.save ? "black" : "default",
                  display: "flex",
                  alignItems: "center",
                }}
                disabled={loading[`save-${blog._id}`]}
              >
                {loading[`save-${blog._id}`] ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "black",
                        fontSize: "0.875rem",
                        marginRight: "4px",
                      }}
                    >
                      {blog.saves.length}
                    </Typography>
                    {blog.save ? <Bookmark /> : <BookmarkBorder />}
                  </>
                )}
              </IconButton>
            </Box>
          </Box>
        </Card>
      ))}
      {loading.loadingMore && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default UserDashboard;
