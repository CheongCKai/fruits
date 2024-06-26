// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';

// export const fetchFruitsData = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/fruits`);
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error('Error response:', error.response.data);
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error('Error request:', error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error('Error message:', error.message);
//       }
//       throw error;
//     }
//   };
  
// export const fetchOrders = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/orders`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     throw error;
//   }
// };
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', 
});

export default api;

