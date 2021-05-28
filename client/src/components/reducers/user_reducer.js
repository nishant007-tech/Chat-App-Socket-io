import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    GET_USERS,
    GET_MESSAGES
} from '../actions/types';


export default function userReducer(state = [], action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, token: action.payload.data.token, userId: action.payload.data.user._id }
        case AUTH_USER:
            return { ...state, user: action.payload.data.user._id, username: action.payload.data.user.name }
        case LOGOUT_USER:
            return { ...state }
        case GET_USERS:
            return { ...state, users: action.payload }
        case GET_MESSAGES:
            return { ...state, messages: action.payload }
        default:
            return state;
    }
}