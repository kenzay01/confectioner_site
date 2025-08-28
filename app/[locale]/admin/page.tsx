"use client";
import React, { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Masterclass } from "@/types/masterclass";
import { OnlineProduct } from "@/types/products";
// import { constants } from "crypto";
import { useItems } from "@/context/itemsContext";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface DateTimeSlot {
  id: string;
  date: string;
  time: string;
}

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { refreshMasterclasses, refreshOnlineProducts } = useItems();
  const currentLanguage = useCurrentLanguage();
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [onlineProducts, setOnlineProducts] = useState<OnlineProduct[]>([]);
  const [newMasterclass, setNewMasterclass] = useState<Partial<Masterclass>>({
    dateType: "single",
    date: "",
    dateEnd: "",
    dateTimes: [],
    location: { pl: "", en: "" },
    title: { pl: "", en: "" },
    photo: "",
    description: { pl: "", en: "" },
    price: 0,
    availableSlots: 0,
    pickedSlots: 0,
    faqs: { pl: [], en: [] },
  });
  const [newProduct, setNewProduct] = useState<Partial<OnlineProduct>>({
    type: "course",
    title: { pl: "", en: "" },
    description: { pl: "", en: "" },
    price: 0,
    photo: "",
  });
  const [editingMasterclass, setEditingMasterclass] =
    useState<Masterclass | null>(null);
  const [editingProduct, setEditingProduct] = useState<OnlineProduct | null>(
    null
  );
  const [language, setLanguage] = useState<"pl" | "en">("pl");
  const [currentTab, setCurrentTab] = useState<"masterclasses" | "products">(
    "masterclasses"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [newFaq, setNewFaq] = useState<{
    question: string;
    answer: string;
  }>({
    question: "",
    answer: "",
  });

  // Fetch masterclasses and products on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [masterclassRes, productRes] = await Promise.all([
          fetch("/api/masterclasses"),
          fetch("/api/online-products"),
        ]);
        if (masterclassRes.ok) {
          const masterclassesData = await masterclassRes.json();
          setMasterclasses(masterclassesData);
        } else {
          setErrorMessage("Не вдалося завантажити майстер-класи");
        }
        if (productRes.ok) {
          const productsData = await productRes.json();
          setOnlineProducts(productsData);
        } else {
          setErrorMessage("Не вдалося завантажити продукти");
        }
      } catch (error) {
        setErrorMessage("Помилка при завантаженні даних");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddMasterclass = async () => {
    if (
      (newMasterclass.dateType === "single"
        ? newMasterclass.date
        : newMasterclass.date &&
          newMasterclass.dateEnd &&
          newMasterclass.dateTimes?.length) &&
      newMasterclass.title?.pl &&
      newMasterclass.title?.en &&
      newMasterclass.description?.pl &&
      newMasterclass.description?.en &&
      newMasterclass.location?.pl &&
      newMasterclass.location?.en &&
      newMasterclass.price &&
      newMasterclass.availableSlots
    ) {
      const masterclassToAdd: Masterclass = {
        ...newMasterclass,
        id: Date.now().toString(),
        pickedSlots: 0,
        faqs: newMasterclass.faqs || { pl: [], en: [] },
      } as Masterclass;
      try {
        const res = await fetch("/api/masterclasses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(masterclassToAdd),
        });
        if (res.ok) {
          const addedMasterclass = await res.json();
          setMasterclasses([...masterclasses, addedMasterclass]);
          setNewMasterclass({
            dateType: "single",
            date: "",
            dateEnd: "",
            dateTimes: [],
            location: { pl: "", en: "" },
            title: { pl: "", en: "" },
            photo: "",
            description: { pl: "", en: "" },
            price: 0,
            availableSlots: 0,
            pickedSlots: 0,
            faqs: { pl: [], en: [] },
          });
          setNewFaq({
            question: "",
            answer: "",
          });
          setErrorMessage("");
          refreshMasterclasses();
        } else {
          setErrorMessage("Не вдалося додати майстер-клас");
        }
      } catch (error) {
        setErrorMessage("Помилка при додаванні майстер-класу");
      }
    } else {
      setErrorMessage("Будь ласка, заповніть усі поля для всіх мов.");
    }
  };

  const handleEditMasterclass = async () => {
    if (editingMasterclass) {
      try {
        const res = await fetch(`/api/masterclasses/${editingMasterclass.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingMasterclass),
        });
        if (res.ok) {
          const updatedMasterclass = await res.json();
          setMasterclasses(
            masterclasses.map((m) =>
              m.id === updatedMasterclass.id ? updatedMasterclass : m
            )
          );
          setEditingMasterclass(null);
          setNewFaq({
            question: "",
            answer: "",
          });
          setErrorMessage("");
          refreshMasterclasses();
        } else {
          setErrorMessage("Не вдалося оновити майстер-клас");
        }
      } catch (error) {
        setErrorMessage("Помилка при оновленні майстер-класу");
      }
    }
  };

  const handleDeleteMasterclass = async (id: string) => {
    try {
      const res = await fetch(`/api/masterclasses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMasterclasses(masterclasses.filter((m) => m.id !== id));
        setErrorMessage("");
        refreshMasterclasses();
      } else {
        setErrorMessage("Не вдалося видалити майстер-клас");
      }
    } catch (error) {
      setErrorMessage("Помилка при видаленні майстер-класу");
    }
  };

  const handleAddProduct = async () => {
    if (
      newProduct.type &&
      newProduct.title?.pl &&
      newProduct.title?.en &&
      newProduct.description?.pl &&
      newProduct.description?.en &&
      newProduct.price
    ) {
      const productToAdd: OnlineProduct = {
        ...newProduct,
        id: Date.now().toString(),
      } as OnlineProduct;
      try {
        const res = await fetch("/api/online-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToAdd),
        });
        if (res.ok) {
          const addedProduct = await res.json();
          setOnlineProducts([...onlineProducts, addedProduct]);
          setNewProduct({
            type: "course",
            title: { pl: "", en: "" },
            description: { pl: "", en: "" },
            price: 0,
            photo: "",
          });
          setErrorMessage("");
          refreshOnlineProducts();
        } else {
          setErrorMessage("Не вдалося додати продукт");
        }
      } catch (error) {
        setErrorMessage("Помилка при додаванні продукту");
      }
    } else {
      setErrorMessage("Будь ласка, заповніть поля для всіх мов.");
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct) {
      try {
        const res = await fetch(`/api/online-products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        });
        if (res.ok) {
          const updatedProduct = await res.json();
          setOnlineProducts(
            onlineProducts.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            )
          );
          setEditingProduct(null);
          setErrorMessage("");
          refreshOnlineProducts();
        } else {
          setErrorMessage("Не вдалося оновити продукт");
        }
      } catch (error) {
        setErrorMessage("Помилка при оновленні продукту");
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/online-products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOnlineProducts(onlineProducts.filter((p) => p.id !== id));
        setErrorMessage("");
        refreshOnlineProducts();
      } else {
        setErrorMessage("Не вдалося видалити продукт");
      }
    } catch (error) {
      setErrorMessage("Помилка при видаленні продукту");
    }
  };

  function handleImageUpload<T>(
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<T>>,
    field: string
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [field]: reader.result as string,
          };
        });
      };
      reader.readAsDataURL(file);
    }
  }

  const addFaq = (
    setState:
      | React.Dispatch<React.SetStateAction<Partial<Masterclass>>>
      | React.Dispatch<React.SetStateAction<Masterclass | null>>
  ) => {
    if (newFaq.question && newFaq.answer) {
      setState((prev: Masterclass | null) => {
        if (!prev) return prev;
        const currentFaqs = prev.faqs || { pl: [], en: [] };
        return {
          ...prev,
          faqs: {
            ...currentFaqs,
            [language]: [
              ...(currentFaqs[language] || []),
              {
                question: newFaq.question,
                answer: newFaq.answer,
                id: Date.now().toString(),
              } as FAQ,
            ],
          },
        };
      });
      setNewFaq({
        question: "",
        answer: "",
      });
    }
  };

  const removeFaq = (
    faqId: string,
    setState:
      | React.Dispatch<React.SetStateAction<Partial<Masterclass>>>
      | React.Dispatch<React.SetStateAction<Masterclass | null>>,
    faqLanguage: "pl" | "en"
  ) => {
    setState((prev: Masterclass | null) => {
      if (!prev || !prev.faqs) return prev;
      return {
        ...prev,
        faqs: {
          ...prev.faqs,
          [faqLanguage]: (prev.faqs[faqLanguage] as FAQ[]).filter(
            (faq: FAQ) => faq.id !== faqId
          ),
        },
      };
    });
  };

  const generateDateTimes = (
    startDate: string,
    endDate: string
  ): DateTimeSlot[] => {
    if (!startDate || !endDate) return [];
    const dates: DateTimeSlot[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push({
        date: currentDate.toISOString().split("T")[0],
        time: "",
        id: Date.now().toString() + Math.random(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  useEffect(() => {
    if (editingMasterclass || editingProduct) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [editingMasterclass, editingProduct]);

  return (
    <div className="min-h-screen bg-[var(--main-color)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-brown p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Адмін панель</h1>
          <div className="flex gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "pl" | "en")}
              className="bg-brown text-gray-100 border border-gray-300 rounded px-2 py-1"
            >
              <option value="pl">Польська</option>
              <option value="en">Англійська</option>
            </select>
            <button
              onClick={onLogout}
              className="bg-brown hover:bg-brown-hover text-gray-100 font-bold py-2 px-4 rounded"
            >
              Вийти
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCurrentTab("masterclasses")}
            className={`py-2 px-4 rounded ${
              currentTab === "masterclasses" ? "bg-brown-hover" : "bg-brown"
            } text-gray-100`}
          >
            Майстер-класи
          </button>
          <button
            onClick={() => setCurrentTab("products")}
            className={`py-2 px-4 rounded ${
              currentTab === "products" ? "bg-brown-hover" : "bg-brown"
            } text-gray-100`}
          >
            Онлайн продукти
          </button>
        </div>

        {errorMessage && (
          <div className="bg-brown-light border border-brown text-brown px-3 py-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {currentTab === "masterclasses" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Майстер-класи
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-100 mb-1">Тип дати</label>
                  <select
                    value={newMasterclass.dateType || "single"}
                    onChange={(e) => {
                      const dateType = e.target.value as "single" | "range";
                      setNewMasterclass({
                        ...newMasterclass,
                        dateType,
                        dateTimes:
                          dateType === "range"
                            ? generateDateTimes(
                                newMasterclass.date || "",
                                newMasterclass.dateEnd || ""
                              )
                            : [],
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                  >
                    <option value="single">Один день</option>
                    <option value="range">Період</option>
                  </select>
                </div>
                <div
                  className={`${
                    newMasterclass.dateType === "range"
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                      : ""
                  }`}
                >
                  <div>
                    <label className="block text-gray-100 mb-1">
                      Дата початку
                    </label>
                    <input
                      type="date"
                      value={newMasterclass.date || ""}
                      onChange={(e) => {
                        const date = e.target.value;
                        setNewMasterclass({
                          ...newMasterclass,
                          date,
                          dateTimes:
                            newMasterclass.dateType === "range"
                              ? generateDateTimes(
                                  date,
                                  newMasterclass.dateEnd || ""
                                )
                              : [],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    />
                  </div>
                  {newMasterclass.dateType === "range" && (
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Дата закінчення
                      </label>
                      <input
                        type="date"
                        value={newMasterclass.dateEnd || ""}
                        onChange={(e) => {
                          const dateEnd = e.target.value;
                          setNewMasterclass({
                            ...newMasterclass,
                            dateEnd,
                            dateTimes: generateDateTimes(
                              newMasterclass.date || "",
                              dateEnd
                            ),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-100 mb-1">
                    Місце проведення (
                    {language === "pl" ? "Польська" : "Англійська"})
                  </label>
                  <input
                    type="text"
                    value={newMasterclass.location?.[language] || ""}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        location: {
                          pl:
                            language === "pl"
                              ? e.target.value
                              : newMasterclass.location?.pl || "",
                          en:
                            language === "en"
                              ? e.target.value
                              : newMasterclass.location?.en || "",
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Місце проведення"
                  />
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">
                    Заголовок ({language === "pl" ? "Польська" : "Англійська"})
                  </label>
                  <input
                    type="text"
                    value={newMasterclass.title?.[language] || ""}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        title: {
                          pl:
                            language === "pl"
                              ? e.target.value
                              : newMasterclass.title?.pl || "",
                          en:
                            language === "en"
                              ? e.target.value
                              : newMasterclass.title?.en || "",
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Заголовок"
                  />
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">
                    Опис ({language === "pl" ? "Польська" : "Англійська"})
                  </label>
                  <textarea
                    value={newMasterclass.description?.[language] || ""}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        description: {
                          pl:
                            language === "pl"
                              ? e.target.value
                              : newMasterclass.description?.pl ?? "",
                          en:
                            language === "en"
                              ? e.target.value
                              : newMasterclass.description?.en ?? "",
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Опис"
                    rows={1}
                  />
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">Ціна (zł)</label>
                  <input
                    type="number"
                    value={newMasterclass.price || 0}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Ціна (zł)"
                  />
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">
                    Доступні місця
                  </label>
                  <input
                    type="number"
                    value={newMasterclass.availableSlots || 0}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        availableSlots: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Доступні місця"
                  />
                </div>
                <div className="flex items-start flex-col">
                  <label className="block text-gray-100 mb-1">Фото</label>
                  <label className="cursor-pointer bg-brown text-gray-100 py-2 rounded flex items-center gap-2">
                    <ImageIcon size={20} />
                    Додати фото
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, setNewMasterclass, "photo")
                      }
                    />
                  </label>
                  {newMasterclass.photo && (
                    <img
                      src={newMasterclass.photo}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-100 mb-1">
                    FAQ ({language === "pl" ? "Польська" : "Англійська"})
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newFaq.question}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, question: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Питання"
                      />
                      <input
                        type="text"
                        value={newFaq.answer}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, answer: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Відповідь"
                      />
                    </div>
                    <button
                      onClick={() => addFaq(setNewMasterclass)}
                      className="bg-brown hover:bg-brown-hover text-gray-100 py-2 px-4 rounded flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Додати FAQ
                    </button>
                    {newMasterclass.faqs?.[language]?.map((faq) => (
                      <div
                        key={faq.id}
                        className="flex justify-between items-center p-2 bg-[var(--accent-color)] rounded"
                      >
                        <div>
                          <p className="text-gray-100">
                            <strong>Питання:</strong> {faq.question}
                          </p>
                          <p className="text-gray-300">
                            <strong>Відповідь:</strong> {faq.answer}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeFaq(faq.id, setNewMasterclass, language)
                          }
                          className="text-gray-100 hover:text-brown"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddMasterclass}
                className="bg-brown hover:bg-brown-hover text-gray-100 font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <Plus size={20} />
                Додати майстер-клас
              </button>
            </div>

            <hr className="border-gray-300 mt-4" />
            {/* Masterclass List */}
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-gray-300">Завантаження...</p>
              ) : !masterclasses.length ? (
                <p className="text-gray-300">Немає</p>
              ) : (
                masterclasses.map((masterclass) => (
                  <div
                    key={masterclass.id}
                    className="flex justify-between items-center p-4 bg-[var(--accent-color)] rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={masterclass.photo}
                          alt="Masterclass"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-gray-100 font-semibold">
                          {masterclass.title[language]}
                        </h3>
                        <p className="text-gray-300">
                          {masterclass.dateType === "single"
                            ? `${masterclass.date}`
                            : `${masterclass.date} - ${masterclass.dateEnd}`}{" "}
                          | {masterclass.location[language]} |{" "}
                          {masterclass.price} zł | {masterclass.availableSlots}{" "}
                          місць | Заброньовано: {masterclass.pickedSlots}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMasterclass(masterclass)}
                        className="text-gray-100 hover:text-brown"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteMasterclass(masterclass.id)}
                        className="text-gray-100 hover:text-brown"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Edit Masterclass Modal */}
            {editingMasterclass && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-brown p-6 rounded-lg w-[800px]">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Редагувати майстер-клас
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols2 gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Тип дати
                      </label>
                      <select
                        value={editingMasterclass.dateType}
                        onChange={(e) => {
                          const dateType = e.target.value as "single" | "range";
                          setEditingMasterclass({
                            ...editingMasterclass,
                            dateType,
                            dateTimes:
                              dateType === "range"
                                ? generateDateTimes(
                                    editingMasterclass.date,
                                    editingMasterclass.dateEnd || ""
                                  )
                                : [],
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                      >
                        <option value="single">Один день</option>
                        <option value="range">Період</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Дата початку
                      </label>
                      <input
                        type="date"
                        value={editingMasterclass.date}
                        onChange={(e) => {
                          const date = e.target.value;
                          setEditingMasterclass({
                            ...editingMasterclass,
                            date,
                            dateTimes:
                              editingMasterclass.dateType === "range"
                                ? generateDateTimes(
                                    date,
                                    editingMasterclass.dateEnd || ""
                                  )
                                : [],
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                      />
                    </div>
                    {editingMasterclass.dateType === "range" && (
                      <div>
                        <label className="block text-gray-100 mb-1">
                          Дата закінчення
                        </label>
                        <input
                          type="date"
                          value={editingMasterclass.dateEnd}
                          onChange={(e) => {
                            const dateEnd = e.target.value;
                            setEditingMasterclass({
                              ...editingMasterclass,
                              dateEnd,
                              dateTimes: generateDateTimes(
                                editingMasterclass.date,
                                dateEnd
                              ),
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-100 mb-1">
                        Місце проведення (
                        {language === "pl" ? "Польська" : "Англійська"})
                      </label>
                      <input
                        type="text"
                        value={editingMasterclass.location[language]}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            location: {
                              ...editingMasterclass.location,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Місце проведення"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Заголовок (
                        {language === "pl" ? "Польська" : "Англійська"})
                      </label>
                      <input
                        type="text"
                        value={editingMasterclass.title[language]}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            title: {
                              ...editingMasterclass.title,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Заголовок"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Опис ({language === "pl" ? "Польська" : "Англійська"})
                      </label>
                      <textarea
                        value={editingMasterclass.description[language]}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            description: {
                              ...editingMasterclass.description,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Опис"
                        rows={1}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Ціна (zł)
                      </label>
                      <input
                        type="number"
                        value={editingMasterclass.price}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Ціна (zł)"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Доступні місця
                      </label>
                      <input
                        type="number"
                        value={editingMasterclass.availableSlots}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            availableSlots: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Доступні місця"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Заброньовані місця
                      </label>
                      <input
                        type="number"
                        value={editingMasterclass.pickedSlots}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            pickedSlots: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Заброньовані місця"
                      />
                    </div>
                    <div className="flex items-start flex-col">
                      <label className="block text-gray-100 mb-1">Фото</label>
                      <label className="cursor-pointer bg-brown text-gray-100 py-2 rounded flex items-center gap-2">
                        <ImageIcon size={20} />
                        Змінити фото
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, setEditingMasterclass, "photo")
                          }
                        />
                      </label>
                      {editingMasterclass.photo && (
                        <img
                          src={editingMasterclass.photo}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-gray-100 mb-1">
                        FAQ ({language === "pl" ? "Польська" : "Англійська"})
                      </label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newFaq.question}
                            onChange={(e) =>
                              setNewFaq({ ...newFaq, question: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                            placeholder="Питання"
                          />
                          <input
                            type="text"
                            value={newFaq.answer}
                            onChange={(e) =>
                              setNewFaq({ ...newFaq, answer: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                            placeholder="Відповідь"
                          />
                        </div>
                        <button
                          onClick={() => addFaq(setEditingMasterclass)}
                          className="bg-brown hover:bg-brown-hover text-gray-100 py-2 px-4 rounded flex items-center gap-2"
                        >
                          <Plus size={20} />
                          Додати FAQ
                        </button>
                        {editingMasterclass.faqs?.[language]?.map((faq) => (
                          <div
                            key={faq.id}
                            className="flex justify-between items-center p-2 bg-[var(--accent-color)] rounded"
                          >
                            <div>
                              <p className="text-gray-100">
                                <strong>Питання:</strong> {faq.question}
                              </p>
                              <p className="text-gray-300">
                                <strong>Відповідь:</strong> {faq.answer}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                removeFaq(
                                  faq.id,
                                  setEditingMasterclass,
                                  language
                                )
                              }
                              className="text-gray-100 hover:text-brown"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setEditingMasterclass(null)}
                      className="text-gray-100 hover:text-brown"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={handleEditMasterclass}
                      className="bg-brown hover:bg-brown-hover text-gray-100 font-bold py-2 px-4 rounded"
                    >
                      Зберегти
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "products" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Онлайн продукти
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-100 mb-1">
                    Тип продукту
                  </label>
                  <select
                    value={newProduct.type || "course"}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        type: e.target.value as
                          | "course"
                          | "consultation"
                          | "recipe",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                  >
                    <option value="course">Курс</option>
                    <option value="consultation">Консультація</option>
                    <option value="recipe">Книга рецептів</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">
                    Заголовок ({language === "pl" ? "Польська" : "Англійська"})
                  </label>
                  <input
                    type="text"
                    value={newProduct.title?.[language] || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        title: {
                          pl:
                            language === "pl"
                              ? e.target.value
                              : newProduct.title?.pl ?? "",
                          en:
                            language === "en"
                              ? e.target.value
                              : newProduct.title?.en ?? "",
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Заголовок"
                  />
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">
                    Опис ({language === "pl" ? "Польська" : "Англійська"})
                  </label>
                  <textarea
                    value={newProduct.description?.[language] || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: {
                          pl:
                            language === "pl"
                              ? e.target.value
                              : newProduct.description?.pl ?? "",
                          en:
                            language === "en"
                              ? e.target.value
                              : newProduct.description?.en ?? "",
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Опис"
                    rows={1}
                  />
                </div>
                <div>
                  <label className="block text-gray-100 mb-1">Ціна (zł)</label>
                  <input
                    type="number"
                    value={newProduct.price || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                    placeholder="Ціна (zł)"
                  />
                </div>
                <div className="flex items-start flex-col">
                  <label className="block text-gray-100 mb-1">Фото</label>
                  <label className="cursor-pointer bg-brown text-gray-100 py-2 rounded flex items-center gap-2">
                    <ImageIcon size={20} />
                    Додати фото
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, setNewProduct, "photo")
                      }
                    />
                  </label>
                  {newProduct.photo && (
                    <img
                      src={newProduct.photo}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <button
                onClick={handleAddProduct}
                className="bg-brown hover:bg-brown-hover text-gray-100 font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <Plus size={20} />
                Додати продукт
              </button>
            </div>
            <hr className="border-gray-300 mt-4" />

            {/* Online Products List */}
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-gray-300">Завантаження...</p>
              ) : !onlineProducts.length ? (
                <p className="text-gray-300">Немає</p>
              ) : (
                onlineProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-4 bg-[var(--accent-color)] rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={product.photo}
                          alt="Product"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-gray-100 font-semibold">
                          {product.title[language]}
                        </h3>
                        <p className="text-gray-300">
                          {product.type === "course"
                            ? "Курс"
                            : product.type === "consultation"
                            ? "Консультація"
                            : "Книга рецептів"}{" "}
                          | {product.price} zł
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-gray-100 hover:text-brown"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-gray-100 hover:text-brown"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-brown p-6 rounded-lg max-w-lg w-full">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Редагувати продукт
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Тип продукту
                      </label>
                      <select
                        value={editingProduct.type}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            type: e.target.value as
                              | "course"
                              | "consultation"
                              | "recipe",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                      >
                        <option value="course">Курс</option>
                        <option value="consultation">Консультація</option>
                        <option value="recipe">Книга рецептів</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Заголовок (
                        {language === "pl" ? "Польська" : "Англійська"})
                      </label>
                      <input
                        type="text"
                        value={editingProduct.title[language]}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            title: {
                              ...editingProduct.title,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Заголовок"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Опис ({language === "pl" ? "Польська" : "Англійська"})
                      </label>
                      <textarea
                        value={editingProduct.description[language]}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: {
                              ...editingProduct.description,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Опис"
                        rows={1}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-100 mb-1">
                        Ціна (zł)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-[var(--accent-color)] text-gray-100"
                        placeholder="Ціна (zł)"
                      />
                    </div>
                    <div className="flex items-start flex-col">
                      <label className="block text-gray-100 mb-1">Фото</label>
                      <label className="cursor-pointer bg-brown text-gray-100 py-2 rounded flex items-center gap-2">
                        <ImageIcon size={20} />
                        Змінити фото
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, setEditingProduct, "photo")
                          }
                        />
                      </label>
                      {editingProduct.photo && (
                        <img
                          src={editingProduct.photo}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-gray-100 hover:text-brown"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={handleEditProduct}
                      className="bg-brown hover:bg-brown-hover text-gray-100 font-bold py-2 px-4 rounded"
                    >
                      Зберегти
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_LOGIN;
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogin = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        onLogin();
      } else {
        setError("Невірний логін або пароль");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-color)] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-7 md:space-y-8 bg-[var(--accent-color)] p-6 sm:p-7 md:p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-brown">
            Адмін панель
          </h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-sm text-gray-300">
            Введіть свої облікові дані для доступу до адмін панелі
          </p>
        </div>

        {error && (
          <div className="bg-brown-light border border-brown text-brown px-3 sm:px-4 py-2 sm:py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 sm:mt-7 md:mt-8 space-y-4 sm:space-y-5 md:space-y-6">
          <div className="rounded-md space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-100 mb-1">
                Логін
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded relative block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-brown placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-brown focus:border-brown focus:z-10 text-xs sm:text-sm md:text-sm bg-[var(--accent-color)]"
                placeholder="Логін"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-100 mb-1">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded relative block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-brown placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-brown focus:border-brown focus:z-10 text-xs sm:text-sm md:text-sm bg-[var(--accent-color)]"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              disabled={loading}
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent text-xs sm:text-sm md:text-sm font-medium rounded-md text-gray-100 bg-brown hover:bg-brown-hover focus:outline-none focus:ring-2 focus:ring-offset-2 ring-brown disabled:opacity-50"
            >
              {loading ? "Вхід..." : "Увійти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
