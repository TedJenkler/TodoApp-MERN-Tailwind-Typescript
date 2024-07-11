import { createSlice } from '@reduxjs/toolkit';

interface StateSlice {

    value: number;

};

const initialState: StateSlice = {
    value: 0
};

const StateSlice = createSlice({
    name: 'state',
    initialState,
    reducers: {}
});

export default StateSlice.reducer;