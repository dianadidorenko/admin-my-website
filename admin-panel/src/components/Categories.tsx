import React, { useEffect, useState } from "react";
import { Trash, Edit } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { config } from "../../config";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const Categories = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );

  const getCategories = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/categories`);

      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
      toast.error("Ошибка при получении категорий");
    }
  };

  // Обработчик выбора изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Сброс состояния формы
  const resetForm = () => {
    setCategoryName("");
    setImage(null);
    setPreviewImage("");
    setEditMode(false);
    setCurrentCategoryId(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editMode) {
      if (!categoryName || !image) {
        toast.error("Пожалуйста, заполните все поля.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      if (categoryName) formData.append("name", categoryName);
      if (image) formData.append("image", image);

      const url = editMode
        ? `${config.baseUrl}/categories/update/${currentCategoryId}`
        : `${config.baseUrl}/categories/add`;

      const response = editMode
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      if (response.data.success) {
        toast.success(
          editMode
            ? "Категория успешно обновлена."
            : "Категория успешно создана."
        );
        resetForm();
        getCategories();
      }
    } catch (error) {
      toast.error("Ошибка при обработке категории.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await axios.delete(
        `${config.baseUrl}/categories/remove/${id}`
      );
      if (response.data.success) {
        toast.success("Категория успешно удалена.");
        getCategories();
      }
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
      toast.error("Ошибка при удалении категории.");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditMode(true);
    setCurrentCategoryId(category._id);
    setCategoryName(category.name);
    setPreviewImage(category.image);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="mx-auto p-4 border-t">
      <form
        onSubmit={handleCategorySubmit}
        className="space-y-4 max-w-[600px] mx-auto"
      >
        <h1 className="text-3xl font-semibold mb-4">
          {editMode ? "Редактировать категорию" : "Создать категорию"}
        </h1>
        <label htmlFor="categoryName" className="block text-sm font-medium">
          Название категории:
        </label>
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            name="categoryName"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full sm:w-[50%] p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-[50%] py-2 border border-gray-400 text-white rounded-md hover:border-white transition duration-300"
            disabled={isLoading}
          >
            {isLoading
              ? "Загрузка..."
              : editMode
              ? "Обновить категорию"
              : "Создать категорию"}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
          className="text-white"
        />
        {previewImage && (
          <div className="relative w-24 h-24 border border-gray-400">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewImage("");
                setImage(null);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-sm px-2 py-1 rounded-full"
            >
              ✕
            </button>
          </div>
        )}
      </form>

      <h2 className="text-xl font-semibold mt-8 text-center">Категории:</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        {categories.map((category) => (
          <div key={category._id} className="text-center mt-4">
            <div className="relative w-[130px] h-[130px] border-[4px] border-white/30 rounded-full">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 flex gap-2 justify-center items-center opacity-0 hover:opacity-100 bg-black/30 rounded-full transition">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-white hover:text-blue-600 transition duration-300"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
