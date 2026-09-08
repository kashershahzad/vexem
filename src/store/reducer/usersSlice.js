import { createSlice } from '@reduxjs/toolkit';
import ApiRequest from '../../services/ApiRequest';

const initialState = {
  loginUser: {},
  userType: '',
  hasSeen: false,
  token: '',
};

export const usersSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    userReceived(state, action) {
      state.loginUser = action.payload;
    },
    setUserToken(state, action) {
      state.token = action.payload;
    },
    setUserType(state, action) {
      state.userType = action.payload;
    },
    setIntroSeen(state, action) {
      state.hasSeen = action.payload;
    },
    userLogout(state) {
      state.loginUser = {};
      state.token = '';
    },
  },
});

export const {
  userReceived,
  userLogout,
  setUserType,
  setIntroSeen,
  setUserToken,
} = usersSlice.actions;

export const getUserProfile = async (dispatch, id) => {
  try {
    const data = {
      type: 'profile',
      user_id: id,
    };
    if (!id) {
      return false;
    }
    const res = await ApiRequest(data);
    if (res.data?.profile?.id) {
      dispatch(userReceived(res?.data?.profile));
    } else {
      console.log('no user data found');
    }
  } catch (error) {
    console.log(error);
  }
};
