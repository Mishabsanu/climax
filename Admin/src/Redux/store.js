import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    admin: null,
    token:null,
    count:[],
    posts:[]
    
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {  
            state.admin = action.payload.admin;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.admin = null;
            state.token = null;
        },
        setUser: (state, action) => {
            state.admin = action.payload.admin;
        },
         setMove:(state,action)=>{
            state.movie=action.payload.movie
        },
         setCount:(state,action)=>{
            state.count=action.payload.count
        },
        setPosts:(state,action)=>{
            state.posts=action.payload.posts
        },
        setToken: (state, action) => {
            state.token = action.payload.token;
          },
    },
});

export const { setMode, setLogin, setLogout,setMove, setUser, setMessages,setCount,setPosts,setToken } =
    authSlice.actions;
export default authSlice.reducer;