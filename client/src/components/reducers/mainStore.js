import { combineReducers } from 'redux'
import user_reducer from './user_reducer';
import chat_reducer from './chat_reducer'

const rootReducer = combineReducers({
    user_reducer,
    chat_reducer
});
export default rootReducer;