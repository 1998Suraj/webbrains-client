import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { loginService } from "../service/https";
import { setUserData } from "../redux/features/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const LoginPage = () => {
  const [isSignup, setSignup] = useState(false);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSignup ? (
          <SignUp goLogin={() => setSignup(false)} />
        ) : (
          <Login goSignup={() => setSignup(true)} />
        )}
      </Box>
    </Container>
  );
};

const Login = ({ goSignup }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const req = await loginService.post("/login", {
        email: data?.email,
        password: data?.password,
      });
      let user = jwtDecode(req?.data?.token);
      reduxDispatch(setUserData({ ...user }));
      console.log("User: ", user);
      if (user.isAdmin === true) {
        navigate("/admin");
      }else if (user.isApproved === "Pending" || user.isApproved === "Rejected") {
        navigate("/profile");
      } else {
        navigate("/user");
      }
      toast.success("Login Successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something Wronge");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        padding: 4,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Login
      </Typography>
      <Typography variant="body2" sx={{ color: "#B8A8C4", marginBottom: 2 }}>
        Don't have an account?{" "}
        <Link
          onClick={goSignup}
          underline="hover"
          sx={{ color: "#8E44AD", cursor: "pointer" }}
        >
          Sign Up
        </Link>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              placeholder="Email"
              label="Email"
              sx={{ marginBottom: 2 }}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              label="Password"
              sx={{ marginBottom: 2 }}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#8E44AD",
            color: "white",
            padding: "12px 0",
            marginBottom: 2,
            "&:hover": {
              backgroundColor: "#732D91",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
    </Box>
  );
};

const SignUp = ({ goLogin }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loginService.post("/register", {
        email: data?.email,
        password: data?.password,
        username: data?.username,
      });
      goLogin();
      toast.success("User Created Successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something Wronge");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        padding: 4,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Sign Up
      </Typography>
      <Typography variant="body2" sx={{ color: "#B8A8C4", marginBottom: 2 }}>
        If you already have an account?{" "}
        <Link
          onClick={goLogin}
          underline="hover"
          sx={{ color: "#8E44AD", cursor: "pointer" }}
        >
          Login
        </Link>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          rules={{ required: "User Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              placeholder="User Name"
              label="User Name"
              sx={{ marginBottom: 2 }}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : ""}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              placeholder="Email"
              label="Email"
              sx={{ marginBottom: 2 }}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              label="Password"
              sx={{ marginBottom: 2 }}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#8E44AD",
            color: "white",
            padding: "12px 0",
            marginBottom: 2,
            "&:hover": {
              backgroundColor: "#732D91",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
