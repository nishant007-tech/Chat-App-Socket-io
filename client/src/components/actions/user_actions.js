import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    GET_USERS,
    GET_MESSAGES
} from './types';

//async() is thunk function for delay
export const registerUser = (dataToSubmit) => async (dispatch) => {
    let responseData = await axios.post(`/register`, dataToSubmit)
    return dispatch({
        type: REGISTER_USER,
        payload: responseData
    })
}
export const loginUser = (dataToSubmit) => async (dispatch) => {
    const responseData = await axios.post(`/login`, dataToSubmit, {
        withCredentials: true,
    });
    return dispatch({
        type: LOGIN_USER,
        payload: responseData
    })
}
export const logoutUser = () => async (dispatch) => {
    const responseData = await axios.get(`/logout`, {
        withCredentials: true,
    })
    return dispatch({
        type: LOGOUT_USER,
        payload: responseData
    })
}
export const authUser = () => async (dispatch) => {
    let responseData = await axios.get(`/authuser`, {
        withCredentials: true,
    })
    return dispatch({
        type: AUTH_USER,
        payload: responseData
    })
}
export const getAllUsers = () => async (dispatch) => {
    let responseData = await axios.get(`/getallusers`, {
        withCredentials: true,
    })
    return dispatch({
        type: GET_USERS,
        payload: responseData
    })
}
export const getAllMessages = () => async (dispatch) => {
    let responseData = await axios.get(`/getallmessages`, {
        withCredentials: true,
    })
    return dispatch({
        type: GET_MESSAGES,
        payload: responseData
    })
}
// withCredentials sets to true let us send the cookies stored over the browser to the server (like in api: req.cookie("jwt"))