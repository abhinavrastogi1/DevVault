import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL= import.meta.env.VITE_API_URL;
export const verifyUser=createAsyncThunk(
    "verifyUser/authenticationSlice",
    async (_,{dispatch}) => {
        try {
              dispatch(verifyuserReducer(true))
           const response=  await axios.get(`${API_URL}/user/verifyuser`, {
                withCredentials: true
            });
            dispatch(verifyuserReducer(false))
          return response.data;
        } catch (error) {
            dispatch(verifyuserReducer(false))

            console.error("Error verifying user:", error);
            throw error;
        }
    }
)
export const signIn = createAsyncThunk(
    "signIn/authenticationSlice",
    async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/user/signin`, userData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error("Error during sign in:", error);
            throw error;
        }
    }
)
export const signUp = createAsyncThunk(
    "signUp/authenticationSlice",
    async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/user/signup`, userData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error("Error during sign up:", error);
            throw error;
        }})
export const signOut = createAsyncThunk(
    "signOut/authenticationSlice",
    async () => {
        try {
            const response = await axios.get(`${API_URL}/user/signout`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error("Error during sign out:", error);
            throw error;
        }
    }
)
const authenticationSlice = createSlice({
    name: "authenticationSlice",
    initialState: {
        isLoading: false,
        isAuthenticated: false,
        userData: null,
        error: null,
        isVerifyingUser:false
    },
    reducers: {
logoutReducer: (state) => {
            state.isAuthenticated = false;
            state.userData = null;
            state.error = null;
        },
verifyuserReducer:(state,action)=>{
    state.isVerifyingUser=action.payload
}
    },
    extraReducers:(builder)=>{
        builder
            .addCase(verifyUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUser.fulfilled, (state,action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.userData = action.payload;
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.error.message;
            })
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.userData = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.error.message;
            })
            .addCase(signUp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signUp.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.error.message;
            })
            .addCase(signOut.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.userData = null;
            })
            .addCase(signOut.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
})
export const { logoutReducer,verifyuserReducer } = authenticationSlice.actions;
export  default authenticationSlice.reducer