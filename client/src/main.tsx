import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import Layout from "./components/Layout.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoreContextProvider from "./context/storeContext.tsx";
import Bestsellers from "./pages/Bestsellers.tsx";
import Info from "./pages/Info.tsx";
import Profile from "./pages/Profile.tsx";
import Cart from "./pages/Cart.tsx";
import ProductPage from "./pages/ProductPage.tsx";

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
        element: <App />,
      },
      {
        path: "/bestsellers",
        element: <Bestsellers />,
      },
      {
        path: "/info",
        element: <Info />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/product/:id",
        element: <ProductPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StoreContextProvider>
    <RouterProvider router={router} />
  </StoreContextProvider>
);
