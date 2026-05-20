import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  verified:boolean;
}

interface Tokens {
  access: string;
  refresh: string;
}

export const useAuth = (): { userDetails: UserDetail | null; tokens: Tokens | null } => {
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [cookies] = useCookies(["iysauth.session-token"]);

  useEffect(() => {
    const dataString = localStorage.getItem("logedinUserDetail");
    const tokenString = localStorage.getItem("tokenData");

    if (dataString !== null) {
      const data: UserDetail = JSON.parse(dataString);
      setUserDetails(data);
    }

    if (tokenString !== null && cookies["iysauth.session-token"]) {
      const data: Tokens = JSON.parse(tokenString);
      setTokens(data);
    }
  }, [cookies]);

  return { userDetails, tokens };
};
