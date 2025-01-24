import React from "react";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Podborki from "./components/Podborki";

const App: React.FC = () => {
  return (
    <>
      <h1 className="font-bold text-4xl p-4 text-center mb-4">Админ панель</h1>
      <Categories />
      <Products />
      <Podborki />
    </>
  );
};

export default App;
