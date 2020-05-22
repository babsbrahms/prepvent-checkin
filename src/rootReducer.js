import { combineReducers } from 'redux'
import record from './reducer/recordReducer'

const reducer = combineReducers({
    record
})

export default reducer;