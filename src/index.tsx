import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { generateRoutes } from "./router";
import useLocalStorage from "react-use/lib/useLocalStorage";

const MainPage = React.lazy(() => import("./Main"));
const LoginPage = React.lazy(() => import("./login"));

function App() {
  const navigate = useNavigate();
  const [cachedLogin, setCachedLogin] = useLocalStorage("login", false);
  const [router, setRouter] = useState<Router[]>([]);
  const [login, setLogin] = useState(false);

  const injectRouter = () => {
    const generated = generateRoutes([
      {
        path: "/",
        children: [
          {
            index: true,
          },
          {
            path: "/courses",
            children: [
              {
                index: true,
              },
              {
                path: "/courses/:id",
              },
            ],
          },
          {
            path: "*",
            keepAlive: true,
          },
        ],
      },
    ]);

    setRouter(generated);
  };

  const onLogin = () => {
    if (cachedLogin) {
      setLogin(false);
      setCachedLogin(false);
      navigate("/", { replace: true });
    } else {
      setLogin(true);
      setCachedLogin(true);
      injectRouter();
    }
  };

  useEffect(() => {
    if (cachedLogin) {
      setLogin(true);
      injectRouter();
    }
  }, [cachedLogin]);

  return (
    <div>
      <button onClick={onLogin}>{cachedLogin ? "退出" : "登录"}</button>
      <Suspense fallback={<div>Loading...</div>}>{login ? <MainPage routes={router} /> : <LoginPage />}</Suspense>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
