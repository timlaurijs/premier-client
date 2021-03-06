import { apiUrl } from "../../config/constants"
import { selectToken } from "./selectors"
import axios from "axios"
import {
  appLoading,
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions"

export const UPDATE_SCORE = "UPDATE_SCORE"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const TOKEN_STILL_VALID = "TOKEN_STILL_VALID"
export const LOG_OUT = "LOG_OUT"

export const login = (email, password) => {
  return async (dispatch, getState) => {
    dispatch(appLoading())
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      })
      dispatch(loginSuccess(response.data))
      dispatch(showMessageWithTimeout("success", false, "welcome back!", 1500))
      dispatch(appDoneLoading())
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message)
        dispatch(setMessage("danger", true, error.response.data.message))
      } else {
        console.log(error.message)
        dispatch(setMessage("danger", true, error.message))
      }
      dispatch(appDoneLoading())
    }
  }
}

const updateScore = (newScore) => {
  return {
    type: UPDATE_SCORE,
    payload: newScore,
  }
}

const loginSuccess = (userWithToken) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userWithToken,
  }
}

export const logOut = () => ({ type: LOG_OUT })

export const updateProgressUser = (score, userId) => {
  return async (dispatch, getState) => {
    dispatch(appLoading());
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        `${apiUrl}/users/progress/${userId}`,
        {
          score,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(updateScore(response.data.progress));
      dispatch(showMessageWithTimeout("success", true, "account created"));
      dispatch(appDoneLoading());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(setMessage("danger", true, error.response.data.message));
      } else {
        console.log(error.message);
        dispatch(setMessage("danger", true, error.message));
      }
      dispatch(appDoneLoading());
    }
  };
};

export const signUp = (name, description, email, password, imageUrl) => {
  return async (dispatch, getState) => {
    dispatch(appLoading())
    try {
      const response = await axios.post(`${apiUrl}/signup`, {
        name,
        description,
        email,
        password,
        imageUrl,
      })

      dispatch(loginSuccess(response.data))
      dispatch(showMessageWithTimeout("success", true, "account created"))
      dispatch(appDoneLoading())
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message)
        dispatch(setMessage("danger", true, error.response.data.message))
      } else {
        console.log(error.message)
        dispatch(setMessage("danger", true, error.message))
      }
      dispatch(appDoneLoading())
    }
  }
}

export const getUserWithStoredToken = () => {
  return async (dispatch, getState) => {
    const token = selectToken(getState())
    if (token === null) return
    dispatch(appLoading())
    try {
      const response = await axios.get(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      dispatch(tokenStillValid(response.data))
      dispatch(appDoneLoading())
    } catch (error) {
      if (error.response) {
        console.log(error.response.message)
      } else {
        console.log(error)
      }
      dispatch(logOut())
      dispatch(appDoneLoading())
    }
  }
}

const tokenStillValid = (userWithoutToken) => ({
  type: TOKEN_STILL_VALID,
  payload: userWithoutToken,
})

export const updateUserData = (
  id,
  token,
  name,
  description,
  email,
  imageUrl
) => {
  return async (dispatch, getState) => {
    if (token === null) return
    dispatch(appLoading())
    try {
      const response = await axios.patch(
        `${apiUrl}/users/${id}`,
        {
          name,
          description,
          email,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      dispatch(getUserWithStoredToken())
      dispatch(appDoneLoading())
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message)
        dispatch(setMessage("danger", true, error.response.data.message))
      } else {
        console.log(error.message)
        dispatch(setMessage("danger", true, error.message))
      }
      dispatch(appDoneLoading())
    }
  }
}
