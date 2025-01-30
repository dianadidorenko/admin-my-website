import { useContext, useState } from "react";
import axios from "axios";

import { config } from "../../config";
import { StoreContext } from "../context/storeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const { setToken } = useContext(StoreContext)!;
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${config?.baseUrl}/users/register`,
        data
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Регистрация успешна!");

        // Перенаправление на страницу логина
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 py-10">
      <form
        onSubmit={onRegister}
        className="shadow-lg bg-white rounded-2xl px-10 pt-8 pb-10 w-full max-w-lg"
      >
        <h1 className="text-3xl text-center font-extrabold text-gray-800 mb-8">
          Регистрация
        </h1>
        <div className="mb-6">
          <input
            type="text"
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            placeholder="Ваше имя"
            required
            className="shadow-lg appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
          />
        </div>
        <div className="mb-6">
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Ваш имейл"
            required
            className="shadow-lg appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
          />
        </div>
        <div className="mb-8">
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Пароль"
            required
            className="shadow-lg appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-300 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
