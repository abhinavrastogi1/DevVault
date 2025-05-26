import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL= import.meta.env.VITE_API_URL;
export const verifyUser=createAsyncThunk(
    "verifyUser/authenticationSlice",
    async () => {
        try {
             await axios.get(`${API_URL}/user/verifyuser`, {
                withCredentials: true
            });
          
        } catch (error) {
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
        error: null
    },
    reducers: {
    }
})
export  default authenticationSlice.reducer