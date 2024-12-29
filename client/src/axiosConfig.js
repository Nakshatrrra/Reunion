import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reunion-fkv4.onrender.com/api', // Replace with your backend URL
});

export default instance;
