import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set correctly in your environment
 export const getAllSnippets = createAsyncThunk(
    "snippetSlice/getAllSnippets",
    async (userId) => { 
        try {
            const response = await axios.get(`${API_URL}/snippet/getallsnippets`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching snippets:", error);
            throw error;
        }
    }
)
export const getSnippetById = createAsyncThunk(
  "snippetSlice/getSnippetById",
  async (snippetId) => {
    try {
      const response = await axios.get(`${API_URL}/snippet/getsnippetdata/`, {
        withCredentials: true,
        params: { snippetId: snippetId.trim() }
      },);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching snippet by ID:", error);
      throw error;
    }
  }
);
const snippetSlice = createSlice({
  name: "snippetSlice",
  initialState: {
    snippets: [],
    snippetData: {
      notes:[]
    },
    activeSnippet: null,
    isLoading: false,
    error: null,
    activeTab: "snippets", // Default active tab
  },        
reducers: {
    setSnippets: (state, action) => {
      state.snippets = action.payload;
    },
    setActiveSnippet: (state, action) => {
      state.activeSnippet = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSnippets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSnippets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.snippets = action.payload;
      })
      .addCase(getAllSnippets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getSnippetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })  
      .addCase(getSnippetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.snippetData = action.payload;
      })
      .addCase(getSnippetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },

})
export default snippetSlice.reducer;