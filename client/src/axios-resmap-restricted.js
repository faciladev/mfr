import axios from "axios";
const baseURL = "/api/restricted";
const instance = axios.create({
  baseURL,
  responseType: "json"
});

export default instance;
