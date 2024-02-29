import axios from "axios";

let authCalls = null;
export const initAuth = () => {
  const token = localStorage.getItem("token");
  authCalls = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

initAuth();

export const signUp = (user) => {
  return authCalls.post(`/signup`, user).then((r) => {
    localStorage.setItem("token", r.data.data.token);
    localStorage.setItem("name", r.data.data.user.name);
    localStorage.setItem("name", r.data.data.user.email);
    initAuth();
    return r.data;
  });
};

export const login = (user) => {
  return authCalls.post(`/login`, user).then((r) => {
    localStorage.setItem("token", r.data.data.token);
    localStorage.setItem("name", r.data.data.user.name);
    localStorage.setItem("email", r.data.data.user.email);
    initAuth();
    return r.data;
  });
};

export const update = (user) => {
  return authCalls.patch(`/user`, user).then((r) => {
    localStorage.setItem("name", r.data.name);
    return r.data;
  });
};