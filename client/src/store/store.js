import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';

// Create Store
const store = configureStore({
    reducer : {
        auth : authReducer,
    }
})

// export store
export default store;