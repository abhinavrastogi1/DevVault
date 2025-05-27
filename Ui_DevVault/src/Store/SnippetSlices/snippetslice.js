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
export const createUpdateSnippet = createAsyncThunk( 
  "snippetSlice/createUpdateSnippet",
  async (snippetData) => {
    try {
      const response = await axios.post(`${API_URL}/snippet/createsnippet`, snippetData, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating/updating snippet:", error);
      throw error;
    }
  }
 )  
 export const deleteSnippet = createAsyncThunk(
  "snippetSlice/deleteSnippet",
  async (snippetId) => {
    try {
      const response = await axios.delete(`${API_URL}/snippet/deletesnippet`, {
        withCredentials: true,
        data: { snippetId }
      });
      return response.data.data;
    } catch (error) {
      console.error("Error deleting snippet:", error);
      throw error;
    }
  }
);
export const deleteTask = createAsyncThunk(
  "snippetSlice/deleteTask",
  async (taskId) => {
    try {
        await axios.delete(`${API_URL}/snippet/deletetask`, {
        withCredentials: true,
        params:{taskId: taskId}
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
)
export const saveSnippet = createAsyncThunk(
  "snippetSlice/saveSnippet",
  async (snippetData) => {
    try {
      const response = await axios.post(`${API_URL}/snippet/savesnippet`, snippetData, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      console.error("Error saving snippet:", error);
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
      })
      .addCase(createUpdateSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUpdateSnippet.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the snippetData with the newly created/updated snippet
        state.snippetData = action.payload;
      })
      .addCase(createUpdateSnippet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSnippet.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted snippet from the snippets array
        state.snippets = state.snippets.filter(snippet => snippet.snippet_id !== action.payload.snippet_id);
      })
      .addCase(deleteSnippet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(saveSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSnippet.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the snippetData with the saved snippet
        state.snippets = action.payload;
      })
      .addCase(saveSnippet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
  },

})
export default snippetSlice.reducer;