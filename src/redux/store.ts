import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import courseReducer from './courseSlice';


// Configuration for redux-persist
const persistConfig = {
    key: 'root',
    storage,
    // By not specifying whitelist or blacklist, everything will be persisted
  };

  // Combine your reducers
  const rootReducer = combineReducers({
    user: userReducer,
    course:courseReducer,
    // Add other reducers here if you have more slices
  });

  // Wrap the rootReducer with persistReducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);

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
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
