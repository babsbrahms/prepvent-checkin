import { ADD_RECORD, CLEAR_RECORD, CHECK_IN, CHECK_OUT } from '../types'

let init = {
    eventId: '',
    path: '',
    url: '',
    list: [],
    count: 0,
    checked: 0
}

function recordReducer (state = init, action) {
    switch (action.type) {
        case ADD_RECORD:
            return state = { eventId: '', path: '', url: '', checked: 0, ...action.payload };
        case CLEAR_RECORD:
            return state = { }

        case CHECK_IN: 
            state.checked = state.checked + 1;
            state.list[action.payload].checkin_status = true;
            state.list[action.payload].timestamp = new Date().getTime();

            return state = { ...state }

        case CHECK_OUT: 
            state.checked = state.checked - 1;
            state.list[action.payload].checkin_status = false;
            state.list[action.payload].timestamp = new Date().getTime();

            return state = { ...state }

        default:
            return state;
    }
}

export default recordReducer;