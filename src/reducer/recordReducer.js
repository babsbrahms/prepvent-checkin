import { ADD_RECORD, CLEAR_RECORD, LOCAL_CHECK_IN, LOCAL_CHECK_OUT } from '../types'

let init = {
    eventId: '',
    path: '',
    url: '',
    list: [],
    count: 0,
    checked: 0,
    keys: [], 
    groups: [],
    filename: '',
    method: '',
}

function recordReducer (state = init, action) {
    switch (action.type) {
        case ADD_RECORD:
            return state = { eventId: '', path: '', url: '', checked: 0, ...action.payload };
        case CLEAR_RECORD:
            return state = { }

        case LOCAL_CHECK_IN: 
            state.checked = state.checked + 1;
            state.list[action.payload.id].checkin_status = true;
            state.list[action.payload.id].timestamp = new Date().getTime();
            console.log('group: ', action.payload.group);
            
            // if (!!action.payload.group) {
            //     let index = state.groups.findIndex(i => i.x === action.payload.group);

            //     if (index < 0) {
            //         state.groups = [...state.groups, { x: action.payload.group, y: 1 }]
            //     } else {
            //         state.groups[index].y = state.groups[index].y + 1;
            //     }
            // }

            return state = { ...state }

        case LOCAL_CHECK_OUT: 
            state.checked = state.checked - 1;
            state.list[action.payload.id].checkin_status = false;
            state.list[action.payload.id].timestamp = new Date().getTime();

            // if (!!action.payload.group) {
            //     let index = state.groups.findIndex(i => i.x === action.payload.group);

            //     if (index < 0) {
            //         state.groups = state.groups.splice(index, 1)
            //     } else {
            //         state.groups[index].y = state.groups[index].y - 1;
            //     }
            // }

            return state = { ...state }

        default:
            return state;
    }
}

export default recordReducer;