import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";

import "./index.css";
import Layout from "./components/Layout.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./App.tsx";
import StoreContextProvider from "./context/showContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const RouterLayout = () => {
  return (
    <Layout>
      <ScrollRestoration />
      <Outlet />
    </Layout>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute isAdminRoute={true}>
            <App />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

// Рендеринг приложения
createRoot(document.getElementById("root")!).render(
  <StoreContextProvider>
    <RouterProvider router={router} />
  </StoreContextProvider>
);
