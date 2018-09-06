import axios from "axios";
const baseURL = "/api/public";
const instance = axios.create({
  baseURL,
  responseType: "json"
});

export default instance;
