import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserState{
    id:string;
    username:string;
    email:string;
    profilePicture?:string|null;
    bio?:string;
    phone?:string;
    coursesEnrolled?:string[];
    completedCourses?:string[];
}

const initialState:UserState={
    id:'',
    username:'',
    email:'',
    bio:'',
    phone:'',
    completedCourses:[],
    coursesEnrolled:[],
    profilePicture:null,
};



export const userSlice  = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
          },
        logout:(state) =>{
            return { ...state };
        }
    }
        
  })
  
  // Action creators are generated for each case reducer function
  export const { setUser, logout } = userSlice.actions

  export default userSlice.reducer