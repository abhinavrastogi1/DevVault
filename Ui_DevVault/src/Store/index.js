import { configureStore } from '@reduxjs/toolkit';
import authenticationSlice from "./Authantication/authenticationSlice.js"
import snippetSlice from "./SnippetSlices/snippetslice.js";
const store=configureStore({
    reducer:{
        authenticationSlice:authenticationSlice,
        snippetSlice:snippetSlice
    }
}
)
export default store;