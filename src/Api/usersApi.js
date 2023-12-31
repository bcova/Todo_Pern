import React from 'react';
import axios from 'axios';

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post('https://daily-do-ewxh.onrender.com/users/register', {
      username: username,
      password: password,
    });
    return { success: true, data: response.data }; // Return success status and response data
  } catch (error) {
    if (error.response) {
      // If the error has a response from the server
      return { success: false, error: error.response.data };
    } else {
      // If there's no response from the server, handle network or other errors
      return { success: false, error: 'Network or server error' };
    }
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:5555/users/login', {
      username: username,
      password: password,
    });
    return { success: true, data: response.data }; // Return success status and response data
  } catch (error) {
    if (error.response) {
      // If the error has a response from the server
      return { success: false, error: error.response.data };
    } else {
      // If there's no response from the server, handle network or other errors
      return { success: false, error: 'Network or server error' };
    }
  }
}
