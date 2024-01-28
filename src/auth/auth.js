import React, { useEffect, useState } from "react";

export const UserContext = React.createContext({
  userData: "",
  isLoggedIn: false,
  setUserData: (userData) => {},
  isLoadingUserData: true,
});

const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        setIsLoadingUserData(false);
        return;
      }

      const userDataParsed = JSON.parse(userData);
      setUserData(userDataParsed);
      setIsLoggedIn(true);
      setIsLoadingUserData(false);
    } catch (error) {
      setIsLoadingUserData(false);
      logout();
    }
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsLoggedIn(true);
      setUserData(userData);
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("userData");
      setUserData("");
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    userData,
    isLoggedIn,
    logout,
    login,
    isLoadingUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
