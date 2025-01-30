import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/showContext";
import logo from "../assets/logo.svg";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { token, setToken } = useContext(StoreContext)!;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="navbar p-6 flex items-center justify-between">
      <Link to={"/"}>
        <img src={logo} alt="logo" className="h-[25px]" />
      </Link>
      {token && (
        <div className="flex items-center gap-2">
          <button onClick={() => logout()}>Выйти</button>
          <LogOut />
        </div>
      )}
    </div>
  );
};

export default Navbar;
