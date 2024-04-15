import axios from "axios";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Chache-control": "no-cache",
  Expires: 0,
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (response) => response,
  (err) => Promise.reject(err)
);

export default instance;
