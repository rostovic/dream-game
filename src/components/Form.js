import classes from "./Form.module.css";
import { useContext, useRef, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { createNewAccount, loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../auth/auth";

const Form = ({ type, navigateTo }) => {
  const authCtx = useContext(UserContext);
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (username.length === 0 || password.length === 0) {
      return;
    }
    const response = await loginUser(username, password);
    if (response === "error") {
      return;
    }
    authCtx.login(response);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const createAccount = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const response = await createNewAccount(username, password);
  };

  const renderButtons = () => {
    if (type === "login") {
      return (
        <>
          <button className={classes.loginButton} onClick={login}>
            <span>LOG IN</span>
          </button>
          <button
            className={classes.loginButton}
            onClick={() => {
              navigate(navigateTo);
            }}
          >
            <span>CREATE ACCOUNT</span>
          </button>
        </>
      );
    }

    return (
      <>
        <button className={classes.loginButton} onClick={createAccount}>
          <span>CREATE ACCOUNT</span>
        </button>
        <button
          className={classes.loginButton}
          onClick={() => {
            navigate(navigateTo);
          }}
        >
          <span>RETURN TO LOGIN</span>
        </button>
      </>
    );
  };

  return (
    <div className={classes.mainDiv}>
      {isLoading && (
        <div className={classes.loaderContainer}>
          <div className={classes.loader} />
        </div>
      )}
      <div className={classes.loginDiv}>
        <div className={classes.usernameDiv}>
          <div className={classes.iconDiv}>
            <PersonIcon
              sx={{
                width: "20px",
                height: "20px",
                color: "grey",
              }}
            />
          </div>

          <input
            type="text"
            ref={usernameRef}
            placeholder={
              type === "login" ? "Enter username" : "Pick a new username"
            }
            className={classes.usernameInput}
          />
        </div>
        <div className={classes.passwordDiv}>
          <div className={classes.iconDiv}>
            <LockIcon
              sx={{
                width: "20px",
                height: "20px",
                color: "grey",
              }}
            />
          </div>

          <input
            type="password"
            ref={passwordRef}
            placeholder={
              type === "login" ? "Enter password" : "Pick a new password"
            }
            className={classes.passwordInput}
          />
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          {renderButtons()}
        </div>
      </div>
    </div>
  );
};

export default Form;
