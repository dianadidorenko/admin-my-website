import React from "react";
import { Toaster } from "react-hot-toast";

import Header from "./Header";
import Footer from "./Footer";
// import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      {/* <Footer /> */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
          style: {
            backgroundColor: "black",
            color: "white",
          },
        }}
      />
      <Footer />
    </>
  );
};

export default Layout;
