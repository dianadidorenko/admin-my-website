import Categories from "./components/Categories";
import Podborki from "./components/Podborki";
import Products from "./components/Products";

const App: React.FC = () => {
  return (
    <div>
      <h1 className="font-bold text-4xl pb-4 text-center mb-4">Админ панель</h1>
      <Categories />
      <Products />
      <Podborki />
    </div>
  );
};

export default App;
