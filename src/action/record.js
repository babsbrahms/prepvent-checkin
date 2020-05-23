import { ADD_RECORD, CLEAR_RECORD, LOCAL_CHECK_OUT, LOCAL_CHECK_IN, MODIFY_SCHEMA } from '../types';

export const addRecordAction = (data) => dispatch => dispatch({
    type: ADD_RECORD,
    payload: data
});

export const crearRecordAction = () => dispatch => dispatch({
    type: CLEAR_RECORD,
    payload: {}
})

export const localCheckInAction = (id, group) => dispatch => Promise.resolve().then(() => {
    dispatch({
        type: LOCAL_CHECK_IN,
        payload: { id, group }
    })
})

export const localCheckOutAction = (id, group) => dispatch => Promise.resolve().then(() => dispatch({
    type: LOCAL_CHECK_OUT,
    payload: { id, group }
}))

export const ModifySchemaAction = (data) => dispatch => Promise.resolve().then(() => dispatch({
    type: MODIFY_SCHEMA,
    payload: data
}))