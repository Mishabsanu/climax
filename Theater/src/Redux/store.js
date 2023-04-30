import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    theater: null,
    token:null,
    count:[]
    
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {  
            state.theater = action.payload.theater;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.theater = null;
            state.token = null;
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setTheater: (state, action) => {
            state.theater = action.payload.theater;
        },
        setMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
        setCount: (state, action) => {
            state.count = action.payload.count;
        }

    },
});

export const { setMode, setLogin, setLogout, setPosts, setPost, setTheater, setMessages ,setCount} =
    authSlice.actions;
export default authSlice.reducer;