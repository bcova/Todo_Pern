import axios from "axios"
import { json } from "react-router-dom";

export const addTodo = async (title,description,date,severity,category,user_id) => {
try {
       const response = await axios.post('http://localhost:5555/todos/newTodo', {
            user_id: user_id,
            title: title,
            description: description,
            date: date,
            severity: severity,
            category: category
        })
        return { success: true, data: response.data };
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

export const getTodos = async (user_id) => {

    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:5555/todos/allUserTodos/${user_id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
        })
        return { success: true, data: response.data };
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

export const deleteTodo = async (todoID) => {
    const userDataJSON = sessionStorage.getItem('user');
    const userData = JSON.parse(userDataJSON);
    const userId = userData.user_id;
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(`http://localhost:5555/todos/deleteTodo/${todoID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "UserID": userId
              },
        })
        return { success: true, data: response.data };
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

export const getSingleTodo = async (todoID) => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:5555/todos/singleTodo/${todoID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
        })
        return { success: true, data: response.data };
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

