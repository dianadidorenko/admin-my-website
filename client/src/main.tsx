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
import MustHave from "./pages/MustHave.tsx";
import Travel from "./pages/Travel.tsx";
import OilySkin from "./pages/OilySkin.tsx";
import AntiAging from "./pages/AntiAging.tsx";
import HairRestoration from "./pages/HairRestoration.tsx";

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
      {
        path: "/must-have",
        element: <MustHave />,
      },
      {
        path: "/travel",
        element: <Travel />,
      },
      {
        path: "/oily-skin",
        element: <OilySkin />,
      },
      {
        path: "/anti-aging",
        element: <AntiAging />,
      },
      {
        path: "/hair-restoration",
        element: <HairRestoration />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StoreContextProvider>
    <RouterProvider router={router} />
  </StoreContextProvider>
);
