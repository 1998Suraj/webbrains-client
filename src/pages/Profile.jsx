import React from "react";
import {jwtDecode} from "jwt-decode";
import { Container, Typography, Box } from "@mui/material";

const Profilestatus = () => {
  const token = localStorage.getItem("jwtToken");
  const userDetails = jwtDecode(token);
  const { isApproved } = userDetails;

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
        bgcolor="#f5f5f5"
        p={4}
        borderRadius={2}
        boxShadow={3}
      >
        {isApproved === "Pending" ? (
          <>
            <Typography variant="h4" gutterBottom>
              Profile Under Review
            </Typography>
            <Typography variant="body1">
              Once we approve your profile, you will be able to See and like or save our blogs.
            </Typography>
          </>
        ) : isApproved === "Rejected" ? (
          <>
            <Typography variant="h4" gutterBottom color="error">
              Profile Rejected
            </Typography>
            <Typography variant="body1">
              Unfortunately, your profile has been rejected. Please contact
              support for further assistance.
            </Typography>
          </>
        ) : (
          <Typography variant="h4" gutterBottom>
            Unknown Status
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profilestatus;
