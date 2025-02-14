import React from "react";
import { Toaster } from "react-hot-toast";

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Toaster position="top-right" />
      <Footer />
    </>
  );
};

export default Layout;
