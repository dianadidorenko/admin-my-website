import React, { useEffect, useState } from "react";
import { Trash, Edit } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { config } from "../../config";

interface Podborki {
  _id: string;
  name: string;
  redirectName: string;
  image: string;
}

const Podborki = () => {
  const [podborkiName, setPodborkiName] = useState<string>("");
  const [redirectName, setRedirectName] = useState<string>("");
  const [podborki, setPodborki] = useState<Podborki[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPodborkiId, setCurrentPodborkiId] = useState<string | null>(
    null
  );

  const getPodborki = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/podborki`);

      if (response.data.success) {
        setPodborki(response.data.data);
      } else {
        toast.error("Ошибка при получении подборок");
      }
    } catch (error) {
      console.error("Ошибка при получении подборок:", error);
      toast.error("Ошибка при получении подборок");
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
    setPodborkiName("");
    setRedirectName("");
    setImage(null);
    setPreviewImage("");
    setEditMode(false);
    setCurrentPodborkiId(null);
  };

  const handlePodborkaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editMode) {
      if (!podborkiName || !redirectName || !image) {
        toast.error("Пожалуйста, заполните все поля.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      if (podborkiName) formData.append("name", podborkiName);
      if (image) formData.append("image", image);
      if (redirectName) formData.append("redirectName", redirectName);

      const url = editMode
        ? `${config.baseUrl}/podborki/update/${currentPodborkiId}`
        : `${config.baseUrl}/podborki/add`;

      const response = editMode
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      if (response.data.success) {
        toast.success(
          editMode ? "Подборка успешно обновлена." : "Подборка успешно создана."
        );
        resetForm();
        getPodborki();
      }
    } catch (error) {
      toast.error("Ошибка при обработке подборки.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await axios.delete(
        `${config.baseUrl}/podborki/remove/${id}`
      );
      if (response.data.success) {
        toast.success("Подборка успешно удалена.");
        getPodborki();
      }
    } catch (error) {
      console.error("Ошибка при удалении подборки:", error);
      toast.error("Ошибка при удалении подборки.");
    }
  };

  const handleEditPodborka = (podborka: Podborki) => {
    setEditMode(true);
    setCurrentPodborkiId(podborka._id);
    setRedirectName(podborka.redirectName);
    setPodborkiName(podborka.name);
    setPreviewImage(podborka.image);
  };

  useEffect(() => {
    getPodborki();
  }, []);

  return (
    <div className="mx-auto p-4 border-t">
      <form
        onSubmit={handlePodborkaSubmit}
        className="space-y-4 max-w-[700px] mx-auto"
      >
        <h1 className="text-3xl font-semibold mb-4">
          {editMode ? "Редактировать подборку" : "Создать подборку"}
        </h1>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 w-full flex-col sm:flex-row">
            <div className="flex gap-4 flex-col w-full">
              <label
                htmlFor="podborkaName"
                className="block text-sm font-medium"
              >
                Название подборки:
              </label>
              <input
                type="text"
                name="podborkaName"
                id="podborkaName"
                value={podborkiName}
                onChange={(e) => setPodborkiName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex gap-4 flex-col w-full">
              <label
                htmlFor="redirectName"
                className="block text-sm font-medium"
              >
                Название для редайректа на англ.:
              </label>
              <input
                type="text"
                name="redirectName"
                id="redirectName"
                value={redirectName}
                onChange={(e) => setRedirectName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 border border-gray-400 text-white rounded-md hover:border-white transition duration-300"
            disabled={isLoading}
          >
            {isLoading
              ? "Загрузка..."
              : editMode
              ? "Обновить подборку"
              : "Создать подборку"}
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

      <h2 className="text-xl font-semibold mt-8 text-center">Подборки:</h2>
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {podborki.map((podborka) => (
          <div key={podborka._id} className="flex flex-col items-center gap-2 text-center mt-4">
            <div className="relative w-[130px] h-[130px] border-[4px] border-white/30 rounded-full">
              <img
                src={podborka.image}
                alt={podborka.name}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 flex gap-2 justify-center items-center opacity-0 hover:opacity-100 bg-black/30 rounded-full transition">
                <button
                  onClick={() => handleEditPodborka(podborka)}
                  className="text-white hover:text-blue-600 transition duration-300"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(podborka._id)}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
            <p>{podborka.name}</p>
            <p>/{podborka.redirectName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Podborki;
