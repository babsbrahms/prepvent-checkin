import { MODIFY_SCHEMA } from '../types'

let init = {
    name: '',
    ID: '',
    group: "",
    contact: "",
    "Checkin Status": "_checkin_status"
}

function schemaReducer (state = init, action) {
    switch (action.type) {
        case MODIFY_SCHEMA: 
            state = action.payload;
        default:
            return state;
    }
}

export default schemaReducer;