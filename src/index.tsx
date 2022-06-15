import React, { Suspense, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { generateRoutes } from "./router";

const MainPage = React.lazy(() => import("./Main"));
const LoginPage = React.lazy(() => import("./login"));

function App() {
  const [router, setRouter] = useState<Router[]>([]);
  const [login, setLogin] = useState(false);

  const onLogin = () => {
    setLogin(true);

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
          },
        ],
      },
    ]);

    setRouter(generated);
  };

  return (
    <div>
      <button onClick={onLogin}>登录</button>
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
