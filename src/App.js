import { useContext } from "react";
import UserContextProvider, { UserContext } from "./auth/auth";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Form from "./components/Form";
import MainLayout from "./components/MainLayout";
import Games from "./components/Games";
import Game from "./components/Game";

const App = () => {
  let authRouter = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: "/games",
          element: <Games />,
        },
        {
          path: "/games/:id",
          element: <Game />,
        },
      ],
    },
    { path: "*", element: <Navigate to="/games" /> },
  ]);

  let nonAuthRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Form type="login" navigateTo="/register" key="login" />,
    },
    {
      path: "/register",
      element: <Form type="register" navigateTo="/login" key="register" />,
    },
    { path: "/*", element: <Navigate to="/login" /> },
  ]);

  const Root = () => {
    const authCtx = useContext(UserContext);
    let router;
    if (authCtx.isLoadingUserData) {
      return;
    }
    if (!authCtx.isLoggedIn) {
      router = nonAuthRouter;
    } else {
      router = authRouter;
    }

    return <RouterProvider router={router} />;
  };

  return (
    <UserContextProvider>
      <Root />
    </UserContextProvider>
  );
};

export default App;
