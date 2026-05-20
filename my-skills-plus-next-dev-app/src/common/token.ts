import { API } from "../app/auth/endpoints";

const getaccessYokenEndpoint = `${API.refreshToken}`;
const getverifyaccesstokenEndpoint = `${API.verifyToken}`;

export function setLocalStorage(tokenValue: string, token: any): void {
  localStorage.setItem(tokenValue, JSON.stringify(token));
}

export function getLocalStorage(tokenValue: string): any {
  const token = JSON.parse(localStorage.getItem(tokenValue) || "{}");
  return token;
}

export async function authHeader(): Promise<string | null> {
  const token = JSON.parse(localStorage.getItem("tokenData") || "{}");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token.access,
    }),
  };

  try {
    const response = await fetch(getverifyaccesstokenEndpoint, requestOptions);

    if (!response.ok && response.status === 401) {
      const requestOptions1: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: token?.refresh,
        }),
      };

      try {
        const result = await fetch(getaccessYokenEndpoint, requestOptions1);
        const accessToken = await result.json();

        localStorage.setItem(
          "tokenData",
          JSON.stringify({
            refresh: token?.refresh,
            access: accessToken?.access,
          }),
        );

        return accessToken?.access;
      } catch (error) {
        console.log("Error occurred:", error);
      }
    } else {
      return token?.access;
    }
  } catch (error) {
    console.log("error", error);
  }
  return null;
}
