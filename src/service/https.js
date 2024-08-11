// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const generateInterceptors = (AxiosInstance) => {
// 	AxiosInstance.interceptors.request.use(
// 		async (config) => {
// 			const token = localStorage.getItem("jwtToken");
// 			if (token) {
// 				const jwtPayload = jwtDecode(token);
// 				config.headers.Authorization = `Bearer ${token}`;
// 			}
// 			return config;
// 		},
// 		(error) => {
// 			return Promise.reject(error);
// 		},
// 	);

// 	AxiosInstance.interceptors.response.use(
// 		(response) => response,
// 		async (error) => {
// 			return Promise.reject(error);
// 		},
// 	);
// };

// const generateInterceptorsLogin = (AxiosInstance) => {
// 	AxiosInstance.interceptors.request.use(
// 		async (response) => {
// 			return response;
// 		},
// 		(error) => {
// 			return Promise.reject(error);
// 		},
// 	);

// 	AxiosInstance.interceptors.response.use(
// 		(response) => {
// 			let token = response?.data?.token;
// 			let user = jwtDecode(token)
// 			localStorage.setItem('jwtToken', token)
// 			localStorage.setItem('userData', JSON.stringify(user))
// 			return response
// 		},
// 		async (error) => {
// 			return Promise.reject(error?.response?.data);
// 		},
// 	);
// };

// const apiService = axios.create({
// 	baseURL: 'https://webbrains-backend.onrender.com/api',
// });

// generateInterceptors(apiService);


// const loginService = axios.create({
// 	baseURL: "https://webbrains-backend.onrender.com/api/auth",
// });


// generateInterceptorsLogin(loginService);

// export default apiService;
// export {
// 	loginService
// };


import axios from "axios";
import {jwtDecode} from "jwt-decode";

const generateInterceptors = (AxiosInstance) => {
  AxiosInstance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      return Promise.reject(error);
    }
  );
};

const generateInterceptorsLogin = (AxiosInstance) => {
  AxiosInstance.interceptors.request.use(
    async (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  AxiosInstance.interceptors.response.use(
    (response) => {
      const token = response?.data?.token;
      if (token) {
        const user = jwtDecode(token);
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userData", JSON.stringify(user));
      }
      return response;
    },
    async (error) => {
      return Promise.reject(error?.response?.data);
    }
  );
};

const apiService = axios.create({
  baseURL: "https://webbrains-backend.onrender.com/api",
});

generateInterceptors(apiService);

const loginService = axios.create({
  baseURL: "https://webbrains-backend.onrender.com/api/auth",
});

generateInterceptorsLogin(loginService);

export default apiService;
export { loginService };
