import { useContext, useState } from "react";
import classes from "./MainLayout.module.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { UserContext } from "../auth/auth";
import { Outlet } from "react-router-dom";
import { logoutUser } from "../api/api";

const MainLayout = () => {
  const userCtx = useContext(UserContext);
  const username = userCtx.userData.username;
  const [isLoading, setIsLoading] = useState(false);

  const logoutHandler = () => {
    setIsLoading(true);
    setTimeout(async () => {
      const response = await logoutUser(userCtx.userData.token);
      if (response) {
        userCtx.logout();
      }
      setIsLoading(false);
    }, 500);
  };

  const renderHeader = () => {
    return (
      <div className={classes.mainHeaderDiv}>
        {isLoading && (
          <div className={classes.loaderContainer}>
            <div className={classes.loader} />
          </div>
        )}
        <div className={classes.usernameDiv}>
          <span>Hello, {username}!</span>
        </div>
        <button className={classes.logoutButton} onClick={logoutHandler}>
          <ExitToAppIcon />
          <span>LOG OUT</span>
        </button>
      </div>
    );
  };

  //main return

  return (
    <div className={classes.mainDiv}>
      {renderHeader()}
      <Outlet />
    </div>
  );
};

export default MainLayout;
