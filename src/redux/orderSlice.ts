// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface IOrder {
//   sessionId: string;
//   tutorId: string;
//   userId: string;
//   courseName: string;
//   thumbnail: string;
//   coursePrice: number;
//   courseDiscountPrice: number;
//   createdAt: string;
//   transactionId: string;
//   paymentStatus: boolean;
//   adminShare: string;
//   tutorShare: string;
// }

// const initialState: IOrder = {
//   sessionId: '',
//   tutorId: '',
//   userId:'',
//   courseName: '',
//   thumbnail: '',
//   coursePrice: 0,
//   courseDiscountPrice: 0,
//   createdAt: '',
//   transactionId: '',
//   paymentStatus: false,
//   adminShare: '',
//   tutorShare: ''
// };

// export const orderSlice = createSlice({
//   name: 'order',
//   initialState,
//   reducers: {
//     setOrderData: (state, action: PayloadAction<IOrder>) => {
//       return { ...state, ...action.payload };
//     },
//     clearOrderData: () => initialState 
//   }
// });

// // Action creators
// export const { setOrderData, clearOrderData } = orderSlice.actions;

// export default orderSlice.reducer;
