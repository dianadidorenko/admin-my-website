import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";
import { config } from "../../config";

import InputTextField from "./products/InputTextField";

interface Volume {
  volume: string;
  price: string;
  weight: string;
}

interface Product {
  _id: string;
  productName: string;
  brand: string;
  description: string;
  country: string;
  volumes: Volume[];
  purpose: string[];
  // ДЛЯ НЕСКОЛЬКИХ ФОТО
  images: string[];
  // ДЛЯ ОДНОГО ФОТО
  // image: string;
}

const Products = () => {
  const [name, setName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [volumes, setVolumes] = useState<
    { volume: string; price: string; weight: string }[]
  >([{ volume: "", price: "", weight: "" }]);
  const [purpose, setPurpose] = useState<string[]>([""]);
  // ДЛЯ ОДНОГО ФОТО
  // const [images setImage] = useState<File | null>(null);
  // const [previewImage, setPreviewImage] = useState<string>("");
  //  ДЛЯ НЕСКОЛЬКИХ ФОТО
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [selectedVolumes, setSelectedVolumes] = useState<
    Record<string, number>
  >({});
  const [productDescriptions, setProductDescriptions] = useState<
    Record<string, boolean>
  >({});

  // ДЛЯ ОДНОГО ФОТО
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setImage(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // };

  //  ДЛЯ НЕСКОЛЬКИХ ФОТО
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files); // Получаем массив файлов
      setImages(files); // Сохраняем файлы в состоянии
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Функционал переключения видимости описания товара
  const toggleDesc = (productId: string) => {
    setProductDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Функционал смены инфо об объеме и цене
  const handleVolumeSelect = (productId: string, index: number) => {
    setSelectedVolumes((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  const getSelectedVolume = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    const selectedIndex = selectedVolumes[productId] ?? 0;
    return product?.volumes[selectedIndex];
  };

  // Функционал добавления нового объема и цены
  const handleAddVolume = () => {
    setVolumes([...volumes, { volume: "", price: "", weight: "" }]);
  };

  const handleVolumeChange = (
    index: number,
    field: keyof Volume,
    value: string
  ) => {
    setVolumes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveVolume = (index: number) => {
    setVolumes((prev) => prev.filter((_, i) => i !== index));
  };

  // Функционал добавления назначений товара
  const handleAddPurpose = () => {
    setPurpose([...purpose, ""]);
  };

  // Функционал редактирования назначений товара
  const handlePurposeChange = (index: number, value: string) => {
    setPurpose((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  // Функционал удаления назначений товара
  const handleRemovePurpose = (index: number) => {
    setPurpose((prev) => prev.filter((_, i) => i !== index));
  };

  // Функционал сбросы формы товара после создания или редактирования товара
  const resetForm = () => {
    setName("");
    setBrand("");
    setDescription("");
    setCountry("");
    setVolumes([{ volume: "", price: "", weight: "" }]);
    setPurpose([""]);
    setImages([]);
    setPreviewImages([]);
    setEditMode(false);
    setCurrentProductId(null);
  };

  // Функционал добавления товара
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editMode) {
      if (!name || !brand || !description || !country || volumes.length === 0) {
        toast.error("Пожалуйста, заполните все поля.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("country", country);
      formData.append("volumes", JSON.stringify(volumes));
      formData.append("purpose", JSON.stringify(purpose));
      images.forEach((image) => formData.append("images", image));
      // if (image) formData.append("image", image);

      const url = editMode
        ? `${config.baseUrl}/products/update/${currentProductId}`
        : `${config.baseUrl}/products/add`;

      const response = await axios({
        method: editMode ? "put" : "post",
        url,
        data: formData,
      });

      if (response.data.success) {
        toast.success(
          editMode
            ? "Категория успешно обновлена."
            : "Категория успешно создана."
        );
        resetForm();
        getProducts();
      }
    } catch (error) {
      toast.error("Ошибка при обработке товара.");
      console.error("Ошибка:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функционал редактировани товара
  const handleEditProduct = (product: Product) => {
    setEditMode(true);
    setCurrentProductId(product._id);
    setName(product.productName);
    setBrand(product.brand);
    setDescription(product.description);
    setCountry(product.country);
    setVolumes(product.volumes);
    setPurpose(product.purpose);
    setPreviewImages(product.images);
  };

  // Функционал удаления товара
  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`${config.baseUrl}/products/remove/${productId}`);
      getProducts();
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
    }
  };

  // Функционал получения всех товара
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/products`);

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
      toast.error("Ошибка при получении категорий");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="mx-auto p-4">
      <form
        onSubmit={handleProductSubmit}
        className="flex flex-col gap-4 max-w-[600px] mx-auto"
      >
        <h1 className="text-2xl font-semibold mb-4">Создать товар</h1>
        {/* Название и страна */}
        <div className="flex items-center justify-center gap-2 flex-col sm:flex-row">
          <InputTextField
            name="name"
            value={name}
            onChange={setName}
            placeholder="Название товара"
            required
          />
          <InputTextField
            name="brand"
            value={brand}
            onChange={setBrand}
            placeholder="Название бренда"
            required
          />
        </div>
        {/* Страна */}
        <div className="flex items-center justify-center gap-2">
          <InputTextField
            name="country"
            value={country}
            onChange={setCountry}
            placeholder="Страна производства"
            required
          />
        </div>
        {/* Объем, цена, вес */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-full flex gap-2 flex-col">
            {volumes.map((volume, index) => (
              <div key={index} className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={volume.volume}
                  onChange={(e) =>
                    handleVolumeChange(index, "volume", e.target.value)
                  }
                  placeholder="Объем"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={volume.price}
                  onChange={(e) =>
                    handleVolumeChange(index, "price", e.target.value)
                  }
                  placeholder="Цена"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={volume.weight}
                  onChange={(e) =>
                    handleVolumeChange(index, "weight", e.target.value)
                  }
                  placeholder="Вес"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {volumes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVolume(index)}
                    className="py-2 px-2 border border-gray-400 text-white rounded-md hover:border-white duration-300"
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVolume}
              className="py-2 border border-gray-400 text-white rounded-md hover:border-white duration-300"
            >
              Добавить объем
            </button>
          </div>
        </div>
        {/* Описание */}
        <div>
          <textarea
            name="description"
            value={description}
            rows={7}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            placeholder="Описание товара"
          />
        </div>
        {/* Назначение */}
        <div className="flex justify-center gap-2">
          <div className="w-full flex flex-col gap-2">
            {purpose.map((purposeItem, index) => (
              <div
                key={index}
                className="flex items-center gap-2 flex-col sm:flex-row"
              >
                <input
                  type="text"
                  value={purposeItem}
                  onChange={(e) => handlePurposeChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={`Назначение ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemovePurpose(index)}
                  className="py-2 px-2 border border-gray-400 text-white rounded-md hover:border-white duration-300"
                >
                  Удалить
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPurpose}
              className="py-2 border border-gray-400 text-white rounded-md hover:border-white duration-300"
            >
              Добавить назначение
            </button>
          </div>
        </div>
        {/* Загрузка фотографии */}
        {/* ДЛЯ ОДНОГО ФОТО */}
        {/* <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImages.length > 0 && (
          <div className="relative w-24 h-24">
            <img
              src={previewImages[0]}
              alt="preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewImages([]);
                setImages([]);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-sm p-1 rounded-full"
            >
              ✕
            </button>
          </div>
        )} */}
        {/* ДЛЯ ОДНОГО ФОТО */}
        {/* Загрузка фотографий */}
        {/* ДЛЯ НЕСКОЛЬКИХ ФОТО */}
        <input
          type="file"
          name="images"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          className="text-white"
        />
        {previewImages.length > 0 && (
          <div className="flex gap-2">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={preview}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-sm px-2 py-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {/* ДЛЯ НЕСКОЛЬКИХ ФОТО */}

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 border border-gray-400 text-white rounded-md hover:border-white duration-300"
            disabled={isLoading}
          >
            {isLoading
              ? "Загрузка..."
              : editMode
              ? "Обновить товар"
              : "Создать товар"}
          </button>
        </div>
      </form>

      {/* Отображение товаров */}
      <h2 className="text-xl font-semibold mt-8">Товары:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-5">
        {products.map((product) => {
          const selectedVolume = getSelectedVolume(product._id);

          return (
            <div key={product._id}>
              <div className="relative group border-[1px] shadow-lg border-gray-300 py-2 px-4 rounded-md space-y-4 lg:overflow-y-scroll lg:h-[400px]">
                {/* Отображение изображений */}
                <div className="flex gap-2 overflow-x-scroll scroll-smooth w-full">
                  {product.images.map((item, index) => (
                    <div className="overflow-hidden flex-shrink-0" key={index}>
                      <img
                        src={item}
                        alt={product.productName}
                        className="w-[150px] h-[150px] object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Кнопки редактирования и удаления */}
                <div className="absolute top-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-500 hover:text-blue-700 mx-2 bg-white/50 p-2 rounded-full duration-300"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500 hover:text-red-700 mx-2 bg-white/50 p-2 rounded-full duration-300"
                  >
                    <Trash size={20} />
                  </button>
                </div>

                <p className="text-lg">{product.productName}</p>
                <p>
                  {productDescriptions[product._id] ||
                  product.description.length <= 100
                    ? product.description
                    : `${product.description.slice(0, 100)}...`}{" "}
                  {product.description.length > 100 && (
                    <span
                      className="underline text-[14px] pl-2 cursor-pointer"
                      onClick={() => toggleDesc(product._id)}
                    >
                      {productDescriptions[product._id]
                        ? "Спрятать"
                        : "Показать еще"}
                    </span>
                  )}
                </p>
                <p>Страна производства: {product.country}</p>

                {/* Проверка для отображения объема, цены и веса */}
                <div className="relative space-y-4">
                  <div>
                    <p>
                      Объем:{" "}
                      {selectedVolume?.volume ?? product.volumes[0].volume} мл
                    </p>
                    <p>
                      Цена: {selectedVolume?.price ?? product.volumes[0].price}{" "}
                      грн
                    </p>
                    <p>
                      Вес: {selectedVolume?.weight ?? product.volumes[0].weight}{" "}
                      г
                    </p>
                  </div>

                  {product.volumes.length > 1 ? (
                    <div className="mt-4">
                      <select
                        className="border p-2 rounded-md w-full"
                        onChange={(e) =>
                          handleVolumeSelect(
                            product._id,
                            Number(e.target.value)
                          )
                        }
                        value={selectedVolumes[product._id] ?? 0}
                      >
                        {product.volumes.map((item, index) => (
                          <option key={index} value={index}>
                            {item.volume} мл
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <p>{product.volumes[0].volume} мл</p>
                      <p>{product.volumes[0].price} грн</p>
                      <p>{product.volumes[0].weight} г</p>
                    </div>
                  )}
                </div>

                {/* Отображение назначений */}
                <ul>
                  {product.purpose.map((item, index) => (
                    <li key={index}>Назначение: {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
