import React, { useEffect, useState } from "react";
import { Trash, Edit } from "lucide-react";
import { useDropzone } from "react-dropzone";
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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName && !uploadedImage && !oldImage) {
      toast.error("Пожалуйста, заполните все поля.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", categoryName);
    if (uploadedImage) {
      formData.append("image", uploadedImage);
    } else if (oldImage) {
      formData.append("image", oldImage);
    }

    try {
      let response;
      if (editMode) {
        // Обновление категории
        response = await axios.put(
          `${
            import.meta.env.VITE_BASE_URL
          }/categories/update/${currentCategoryId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Создание новой категории
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/categories/add`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response.data.success) {
        toast.success(
          editMode
            ? "Категория успешно обновлена."
            : "Категория успешно создана."
        );
        setCategoryName("");
        setUploadedImage(null);
        setOldImage(null);
        setEditMode(false);
        getCategories();
      }
    } catch (error) {
      toast.error("Ошибка при обработке категории.");
      console.error("Ошибка:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/categories/remove/${id}`
      );

      if (response.data.success) {
        getCategories();
        toast.success("Категория успешно удалена");
      } else {
        toast.error("Ошибка при удалении категории");
      }
    } catch (error) {
      toast.error("Ошибка при удалении категории");
      console.error("Ошибка:", error);
    }
  };

  const handleEditCategory = async (id: string) => {
    setEditMode(true);
    setCurrentCategoryId(id);

    const category = categories.find((cat) => cat._id === id);
    if (category) {
      setCategoryName(category.name);
      setOldImage(category.image);
      setUploadedImage(null);
    }
  };

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

  useEffect(() => {
    getCategories();
  }, []);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);

    if (acceptedFiles.length > 1) {
      toast.error("Можно загрузить только одно изображение.");
      setIsUploading(false);
      return;
    }

    setUploadedImage(acceptedFiles[0]);
    setIsUploading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        {editMode ? "Редактировать категорию" : "Создать категорию"}
      </h1>
      <form onSubmit={handleCategorySubmit} className="space-y-4">
        <label htmlFor="categoryName" className="block text-sm font-medium">
          Название категории:
        </label>
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            id="categoryName"
            name="name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full sm:w-[50%] p-2 border border-gray-300 rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full sm:w-[50%] py-2 border border-gray-400 text-white rounded-md hover:border-white duration-300"
            disabled={isLoading}
          >
            {isLoading
              ? "Загрузка..."
              : editMode
              ? "Обновить категорию"
              : "Создать категорию"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            {uploadedImage && (
              <div className="mb-4 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover mb-4"
                />
              </div>
            )}
            {editMode && oldImage && !uploadedImage && (
              <div className="flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${oldImage}`}
                  alt="Old Image"
                  className="w-24 h-24 object-cover mb-4"
                />
              </div>
            )}
          </div>

          <div>
            <div
              {...getRootProps()}
              className="border border-gray-400 text-white rounded-md hover:border-white duration-300 p-4 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <p>Загрузка...</p>
              ) : (
                <p>Перетащите файл сюда или кликните для выбора</p>
              )}
            </div>
          </div>
        </div>
      </form>

      <h2 className="text-xl font-semibold mt-8">Категории:</h2>
      <div className="flex gap-2 flex-wrap justify-center">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col p-2 items-center gap-y-1 sm:gap-y-4"
          >
            <div className="relative w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] overflow-hidden border-[6px] shadow-lg border-gray-300 rounded-full">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${category.image}`}
                alt={category.name}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
              />

              {/* Кнопки редактирования и удаления */}
              <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEditCategory(category._id)}
                  className="text-blue-500 hover:text-blue-700 mx-2 bg-white/50 p-2 rounded-full"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-500 hover:text-red-700 mx-2 bg-white/50 p-2 rounded-full"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>

            <span className="text-lg">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
