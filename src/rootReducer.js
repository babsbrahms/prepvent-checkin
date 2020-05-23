import { combineReducers } from 'redux'
import record from './reducer/recordReducer';
import schema from './reducer/schemaReducer'

const reducer = combineReducers({
    record, schema
})

export default reducer;