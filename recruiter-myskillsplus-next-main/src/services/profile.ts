import { getLocalStorage } from "../common/token";
import { API } from "../app/auth/endpoints";
import axios, { AxiosResponse, AxiosError } from "axios";

interface ResponseType {
  data?: any;
  status?: number;
  statusText?: string;
}

const handleRequest = async (
  method: string,
  url: string,
  reqData?: any,
  p0?: { Authorization: string },
): Promise<ResponseType> => {
  try {
    const response: AxiosResponse = await axios({
      method,
      url,
      data: reqData,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      return {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
      };
    } else {
      return {
        status: 500,
        statusText: "Internal Server Error",
      };
    }
  }
};

export const HandleRegister = async (reqData: any): Promise<ResponseType> => {
  return await handleRequest("POST", `${API.register}`, reqData);
};

export const HandleLogin = async (reqData: any): Promise<ResponseType> => {
  return await handleRequest("POST", `${API.login}`, reqData);
};

export const HandleForgotPassword = async (
  reqData: any,
): Promise<ResponseType> => {
  return await handleRequest("POST", `${API.forgotPassword}`, reqData);
};

export const HandleResetPassword = async (
  reqData: any,
): Promise<ResponseType> => {
  return await handleRequest("POST", `${API.resetPassword}`, reqData);
};

export const HandleGetUserByToken = async (): Promise<ResponseType> => {
  const accessToken = getLocalStorage("tokenData")?.access;
  return await handleRequest("GET", `${API.getUserByToken}`, undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
};
