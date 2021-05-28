import {
    SET_MESSAGEIS_READ
} from '../actions/types';

export default function chatReducer(state = {}, action) {
    switch (action.type) {
        case SET_MESSAGEIS_READ:
            return { ...state, msgRead: action.payload }
        default:
            return state;
    }
}