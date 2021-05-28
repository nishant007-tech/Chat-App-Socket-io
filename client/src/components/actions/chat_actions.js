// import axios from 'axios';
import {
    SET_MESSAGEIS_READ
} from './types';

export const setMessageIsRead = (data) => {
    return ({
        type: SET_MESSAGEIS_READ,
        payload: data,
    })
}


