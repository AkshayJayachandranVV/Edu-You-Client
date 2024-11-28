import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import courseReducer from './courseSlice';
import editCourseReducer from './editCourseSlice';
import tutorReducer from './tutorSlice';
import { AnyAction, Reducer } from 'redux';

// Logout action type (you can also define it as a constant elsewhere)
const LOGOUT_ACTION = 'auth/logout';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  editCourse: editCourseReducer,
  tutor: tutorReducer,
  // Add other reducers here if you have more slices
});

// Create a higher-order reducer that handles clearing the state on logout
const appReducer: Reducer<ReturnType<typeof rootReducer>, AnyAction> = (
  state,
  action
) => {
  if (action.type === LOGOUT_ACTION) {
    // Reset the entire state to undefined (clears all slices)
    state = undefined;
  }
  return rootReducer(state, action);
};

// Wrap the appReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, appReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;


export const logoutStore = () => ({ type: LOGOUT_ACTION });
