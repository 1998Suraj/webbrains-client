import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  MoreVert,
  Delete,
  Edit,
  Info,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import apiService from "../service/https";
import moment from "moment";

const AdminDashboard = () => {
  const reduxDispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogDetail, setBlogDetail] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editBlog, setEditBlog] = useState({ title: "", content: "" });
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

      if (pageToLoad === 1) {
        setBlogs(fetchedBlogs);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...fetchedBlogs]);
      }

      setPage(response?.data?.page);
      setTotalPages(response?.data?.totalPages);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading((prev) => ({ ...prev, loadingMore: false }));
    }
  };

  useEffect(() => {
    getBlogs(1);
  }, []);

  const fetchBlogById = async (id) => {
    if (selectedBlog) {
      try {
        setLoading((prev) => ({ ...prev, fetchingDetails: true }));
        const response = await apiService.get(`/posts/get-blog/${selectedBlog._id}`);
        setBlogDetail(response.data);
        setOpenDetailDialog(true);
        handleMenuClose();
      } catch (err) {
        toast.error(err?.message || "Unable to fetch blog details");
      } finally {
        setLoading((prev) => ({ ...prev, fetchingDetails: false }));
      }
    } else {
      toast.error("No blog selected for editing");
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuClick = (event, blog) => {
    console.log("Selected Blog from Menu Click:", blog);
    setAnchorEl(event.currentTarget);
    setSelectedBlog(blog);
    setEditBlog({ title: blog.title, content: blog.content });
  };

  const handleEdit = async () => {
    if (selectedBlog) {
      console.log("Selected Blog for Editing:", selectedBlog);
      console.log("Edited Blog Data:", editBlog);

      try {
        await apiService.put(`/posts/edit-blog/${selectedBlog._id}`, {
          title: editBlog.title,
          content: editBlog.content,
        });

        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === selectedBlog._id
              ? { ...blog, title: editBlog.title, content: editBlog.content }
              : blog
          )
        );
        handleMenuClose();
        toast.success("Blog updated successfully");
      } catch (err) {
        toast.error(err.message || "Unable to update the blog");
      } finally {
        setOpenEditDialog(false);
      }
    } else {
      toast.error("No blog selected for editing");
    }
  };

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
          blog._id === id ? { ...blog, like: !blog.like } : blog
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
          blog._id === id ? { ...blog, save: !blog.save } : blog
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

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBlog(null);
  };

  const handleDelete = async () => {
    if (selectedBlog) {
      try {
        await apiService.delete(`/posts/delete-blog/${selectedBlog._id}`);
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog._id !== selectedBlog._id)
        );
        toast.success("Blog deleted successfully");
      } catch (err) {
        toast.error(err.message || "Unable to delete the blog");
      } finally {
        handleMenuClose();
      }
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
            <Typography variant="body2" color="textSecondary">
              {blog.content}
            </Typography>
          </CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="body2" color="textSecondary">
              Blog Added:{" "}
              {moment(blog.createdAt).format("MMMM Do YYYY, h:mm a")}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => handleLike(blog)}
                color={blog.like ? "primary" : "default"}
                disabled={loading[`like-${blog._id}`]}
              >
                {loading[`like-${blog._id}`] ? (
                  <CircularProgress size={24} />
                ) : blog.like ? (
                  <>
                    <Favorite style={{ color: "#ed4956" }} />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ ml: 0.5 }}
                    >
                      {blog.likes.length}
                    </Typography>
                  </>
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
              <IconButton
                onClick={() => handleSave(blog)}
                color={blog.save ? "primary" : "default"}
                disabled={loading[`save-${blog._id}`]}
              >
                {loading[`save-${blog._id}`] ? (
                  <CircularProgress size={24} />
                ) : blog.save ? (
                  <>
                    <Bookmark style={{ color: "#002b80" }} />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ ml: 0.5 }}
                    >
                      {blog.saves.length}
                    </Typography>
                  </>
                ) : (
                  <BookmarkBorder />
                )}
              </IconButton>
              <IconButton
                onClick={(event) => handleMenuClick(event, blog)}
                aria-controls="simple-menu"
                aria-haspopup="true"
              >
                <MoreVert />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => fetchBlogById(blog._id)}>
                  <Info fontSize="small" sx={{ mr: 1 }} />
                  Details
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setOpenEditDialog(true);
                  }}
                >
                  <Edit fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <Delete fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Card>
      ))}
      {/* Loader at the bottom of the page */}
      {loading.loadingMore && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
      >
        <DialogTitle>Blog Details</DialogTitle>
        <DialogContent>
          {loading.fetchingDetails ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : blogDetail ? (
            <>
              <Typography variant="h6">{blogDetail.title}</Typography>
              <Typography variant="body1">{blogDetail.content}</Typography>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No details available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={editBlog.title}
            onChange={handleEditChange}
            margin="dense"
          />
          <TextField
            name="content"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={editBlog.content}
            onChange={handleEditChange}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
