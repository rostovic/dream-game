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
  const [error, setError] = useState(null);

  console.log(type);

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
    if (response.status === "error") {
      setError(response.message);
    }
  };

  const renderIcon = (type) => {
    if (type === "person") {
      return (
        <PersonIcon
          sx={{
            width: "20px",
            height: "20px",
            color: "grey",
          }}
        />
      );
    }
    return (
      <LockIcon
        sx={{
          width: "20px",
          height: "20px",
          color: "grey",
        }}
      />
    );
  };

  const renderInput = (inputType) => {
    if (inputType === "username") {
      return (
        <input
          type="text"
          ref={usernameRef}
          placeholder={
            type === "login" ? "Enter username" : "Pick a new username"
          }
          className={classes.usernameInput}
          onClick={() => setError(null)}
        />
      );
    }
    return (
      <input
        type="password"
        ref={passwordRef}
        placeholder={
          type === "login" ? "Enter password" : "Pick a new password"
        }
        className={classes.passwordInput}
        onClick={() => setError(null)}
      />
    );
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

  const renderIsLoading = () => {
    if (!isLoading) {
      return;
    }
    return (
      <div className={classes.loaderContainer}>
        <div className={classes.loader} />
      </div>
    );
  };

  const renderError = () => {
    if (!error) {
      return;
    }
    return (
      <div className={classes.errorDiv}>
        <span>{error}</span>
      </div>
    );
  };

  // main return
  return (
    <div className={classes.mainDiv}>
      {renderIsLoading()}
      <div className={classes.loginDiv}>
        <div className={classes.usernameDiv}>
          <div className={classes.iconDiv}>{renderIcon("person")}</div>
          {renderInput("username")}
        </div>
        <div className={classes.passwordDiv}>
          <div className={classes.iconDiv}>{renderIcon("lock")}</div>
          {renderInput("password")}
        </div>
        {renderError()}
        <div className={classes.buttonsDiv}>{renderButtons()}</div>
      </div>
    </div>
  );
};

export default Form;
