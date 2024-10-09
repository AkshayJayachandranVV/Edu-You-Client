import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface TutorState{
    id:string;
    tutorname:string;
    email:string;
    profilePicture?:string|null;
    profilePictureUrl?:string|null;
    bio?:string;
    phone?:string;
    myCourses?:string[];
    totalStudennts?:string[];
}

const initialState:TutorState={
    id:'',
    tutorname:'',
    email:'',
    bio:'',
    phone:'',
    myCourses:[],
    profilePicture:null,
    profilePictureUrl:null,
    totalStudennts:[],
};



export const tutorSlice  = createSlice({
    name:'tutor',
    initialState,
    reducers:{
        setTutor: (state, action: PayloadAction<TutorState>) => {
            return { ...state, ...action.payload };
          },
        logout:(state) =>{
            return { ...state };
        }
    }
        
  })
  
  // Action creators are generated for each case reducer function
  export const { setTutor, logout } = tutorSlice.actions

  export default tutorSlice.reducer