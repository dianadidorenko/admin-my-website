import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Toaster position="top-right" />
    </>
  );
};

export default Layout;
