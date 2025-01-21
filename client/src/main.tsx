import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Bestsellers from "./pages/Bestsellers.tsx";
import Info from "./pages/Info.tsx";

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
      // {
      //   path: "/category",
      //   element: <Category />,
      // },
      // {
      //   path: "/category/:id",
      //   element: <Category />,
      // },
      // {
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   path: "/cart",
      //   element: <Cart />,
      // },
      // {
      //   path: "/favorite",
      //   element: <Favorite />,
      // },
      // {
      //   path: "/orders",
      //   element: <Orders />,
      // },
      // {
      //   path: "/success",
      //   element: <Success />,
      // },
      // {
      //   path: "/cancel",
      //   element: <Cancel />,
      // },
      // {
      //   path: "*",
      //   element: <NotFound />,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
