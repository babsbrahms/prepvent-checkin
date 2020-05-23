import { ADD_RECORD, CLEAR_RECORD, CHECK_OUT, CHECK_IN, MODIFY_SCHEMA } from '../types';

export const addRecordAction = (data) => dispatch => dispatch({
    type: ADD_RECORD,
    payload: data
});

export const crearRecordAction = () => dispatch => dispatch({
    type: CLEAR_RECORD,
    payload: {}
})

export const CheckInAction = (id) => dispatch => Promise.resolve().then(() => {
    dispatch({
        type: CHECK_IN,
        payload: id
    })
})

export const CheckOutAction = (id) => dispatch => Promise.resolve().then(() => dispatch({
    type: CHECK_OUT,
    payload: id
}))

export const ModifySchemaAction = (data) => dispatch => Promise.resolve().then(() => dispatch({
    type: MODIFY_SCHEMA,
    payload: data
}))