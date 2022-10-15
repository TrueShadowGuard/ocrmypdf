import Axios from "axios";

const axios = Axios.create({});

if (process.env.NODE_ENV === "development") axios.baseURL = "http://localhost:7777";

export {axios};