import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Box,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Pagination,
} from "@mui/material";
import apiService from "../service/https";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const getUsers = async (status, page = 1) => {
    setLoading(true);
    try {
      const statusQuery = status === "all" ? "" : `status=${status}`;
      const usersData = await apiService.get(
        `/admin/user-register-list?${statusQuery}&page=${page}&limit=${itemsPerPage}`
      );
      setUsers(usersData?.data?.users);
      setTotalPages(Math.ceil(usersData?.data?.totalUsers / itemsPerPage));
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (searchQuery) => {
    setLoading(true);
    try {
      const searchParam = searchQuery ? `username=${searchQuery}` : "";
      const usersData = await apiService.get(
        `/admin/users-search?${searchParam}`
      );
      setUsers(usersData?.data);
      setTotalPages(Math.ceil(usersData?.data?.totalUsers / itemsPerPage));
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await apiService.put(`/admin/approve/${selectedUser._id}`);
      toast.success("User approved successfully");
      getUsers(filterStatus, currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to approve user");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleReject = async () => {
    try {
      await apiService.put(`/admin/reject/${selectedUser._id}`);
      toast.success("User rejected successfully");
      getUsers(filterStatus, currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to reject user");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleActionClick = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleFilterClick = (status) => {
    setFilterStatus(status);
    getUsers(status, 1);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      searchUsers(searchText);
    } else {
      getUsers(filterStatus);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    getUsers(filterStatus, value);
  };

  useEffect(() => {
    getUsers(filterStatus, currentPage);
  }, [filterStatus, currentPage]);

  return (
    <Box sx={{ marginTop: "20px" }}>
      <Box sx={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
        <Button
          variant={filterStatus === "all" ? "contained" : "outlined"}
          onClick={() => handleFilterClick("all")}
        >
          All Users
        </Button>
        <Button
          variant={filterStatus === "Pending" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleFilterClick("Pending")}
          sx={{ marginLeft: "8px" }}
        >
          Pending
        </Button>
        <Button
          variant={filterStatus === "Approved" ? "contained" : "outlined"}
          color="success"
          onClick={() => handleFilterClick("Approved")}
          sx={{ marginLeft: "8px" }}
        >
          Approved
        </Button>
        <Button
          variant={filterStatus === "Rejected" ? "contained" : "outlined"}
          color="error"
          onClick={() => handleFilterClick("Rejected")}
          sx={{ marginLeft: "8px" }}
        >
          Rejected
        </Button>
        <TextField
          label="Search Username"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ marginLeft: "16px", flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ marginLeft: "8px" }}
        >
          Search
        </Button>
      </Box>
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {users
              .filter((user) => user.isAdmin !== true)
              .map((user) => (
                <Card
                  key={user._id}
                  sx={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          marginRight: "16px",
                          backgroundColor: "#3f51b5",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: "#333" }}>
                          {user.username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {user.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              user.isApproved === "Approved"
                                ? "success.main"
                                : user.isApproved === "Rejected"
                                ? "error.main"
                                : "text.secondary",
                            marginTop: "4px",
                          }}
                        >
                          Status: {user.isApproved}
                        </Typography>
                      </Box>
                    </Box>
                    <CardActions>
                      {user.isApproved === "Pending" && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleActionClick(user, "approve")}
                            sx={{ marginRight: "8px" }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleActionClick(user, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {user.isApproved === "Approved" && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleActionClick(user, "reject")}
                        >
                          Reject
                        </Button>
                      )}
                      {user.isApproved === "Rejected" && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleActionClick(user, "approve")}
                          sx={{ marginRight: "8px" }}
                        >
                          Approve
                        </Button>
                      )}
                    </CardActions>
                  </CardContent>
                </Card>
              ))}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          {actionType === "approve" ? "Approve User" : "Reject User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={actionType === "approve" ? handleApprove : handleReject}
            color={actionType === "approve" ? "primary" : "secondary"}
          >
            {actionType === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
