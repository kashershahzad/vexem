import { combineReducers } from 'redux';

import { usersSlice } from './usersSlice';
import { categorySlice } from './categorySlice';

export const rootReducer = combineReducers({
  user: usersSlice.reducer,
  category: categorySlice.reducer,
});
