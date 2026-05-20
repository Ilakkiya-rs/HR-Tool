import { getLocalStorage } from "../common/token";
import { API } from "../app/auth/endpoints";
import axios, { AxiosResponse, AxiosError } from "axios";

interface ResponseType {
  data?: any;
  status?: number;
  statusText?: string;
}

export const HandleRegister = async (
  reqData: any,
): Promise<ResponseType | AxiosError> => {
  try {
    const response: AxiosResponse = await axios({
      method: "POST",
      url: `${API.register}`,
      data: reqData,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error;
    } else {
      throw error;
    }
  }
};

export const HandleLogin = async (
  reqData: any,
): Promise<ResponseType | AxiosError> => {
  try {
    const response: AxiosResponse = await axios({
      method: "POST",
      url: `${API.login}`,
      data: reqData,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error;
    } else {
      throw error;
    }
  }
};

export const HandleForgotPassword = async (
  reqData: any,
): Promise<ResponseType | AxiosError> => {
  try {
    const response: AxiosResponse = await axios({
      method: "POST",
      url: `${API.forgotPassword}`,
      data: reqData,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error;
    } else {
      throw error;
    }
  }
};

export const HandleResetPassword = async (
  reqData: any,
): Promise<ResponseType | AxiosError> => {
  try {
    const response: AxiosResponse = await axios({
      method: "POST",
      url: `${API.resetPassword}`,
      data: reqData,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error;
    } else {
      throw error;
    }
  }
};

export const HandleGetUserByToken = async (): Promise<
  ResponseType | AxiosError
> => {
  const accessToken = getLocalStorage("tokenData")?.access;

  try {
    const response: AxiosResponse = await axios({
      method: "GET",
      url: `${API.getUserByToken}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error;
    } else {
      throw error;
    }
  }
};
