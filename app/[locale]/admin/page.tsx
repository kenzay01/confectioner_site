"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Package,
  Settings,
  MapPin,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import { Masterclass } from "@/types/masterclass";
import { OnlineProduct } from "@/types/products";
import { Partner } from "@/types/partner";
import { MapLocation } from "@/types/mapLocation";
import { useItems } from "@/context/itemsContext";
import Image from "next/image";

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
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [onlineProducts, setOnlineProducts] = useState<OnlineProduct[]>([]);
  const [newMasterclass, setNewMasterclass] = useState<Partial<Masterclass>>({
    dateType: "single",
    date: "",
    dateEnd: "",
    dateTimes: [],
    location: { pl: "", en: "" },
    city: "", // Miasto dla wyświetlenia na mapie
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
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: { pl: "", en: "" },
    description: { pl: "", en: "" },
    logo: "",
    website: "",
    isActive: true,
  });
  const [polishCities, setPolishCities] = useState<Array<{name: string, lat: number, lng: number}>>([]);
  const [editingMasterclass, setEditingMasterclass] =
    useState<Masterclass | null>(null);
  const [editingProduct, setEditingProduct] = useState<OnlineProduct | null>(
    null
  );
  const [language, setLanguage] = useState<"pl" | "en">("pl");
  const [usePolishForEnglish, setUsePolishForEnglish] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"dashboard" | "masterclasses" | "products" | "partners" | "mapLocations">(
    "dashboard"
  );
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [editingMapLocation, setEditingMapLocation] = useState<MapLocation | null>(null);
  const [showMapLocationForm, setShowMapLocationForm] = useState(false);
  const [showMasterclassForm, setShowMasterclassForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [newFaq, setNewFaq] = useState<{
    question: string;
    answer: string;
  }>({
    question: "",
    answer: "",
  });
  const [isUploadingMapPhoto, setIsUploadingMapPhoto] = useState(false);
  const [mapPhotoUploadError, setMapPhotoUploadError] = useState("");
  const [isUploadingMasterclassPhoto, setIsUploadingMasterclassPhoto] =
    useState(false);
  const [masterclassPhotoUploadError, setMasterclassPhotoUploadError] =
    useState("");

  // Fetch masterclasses and products on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [masterclassRes, productRes, partnersRes, citiesRes, mapLocationsRes] = await Promise.all([
          fetch("/api/masterclasses"),
          fetch("/api/online-products"),
          fetch("/api/partners"),
          fetch("/api/cities"),
          fetch("/api/map-locations"),
        ]);
        if (masterclassRes.ok) {
          const masterclassesData = await masterclassRes.json();
          setMasterclasses(masterclassesData);
        } else {
          setErrorMessage("Nie udało się załadować warsztatów");
        }
        if (productRes.ok) {
          const productsData = await productRes.json();
          setOnlineProducts(productsData);
        } else {
          setErrorMessage("Nie udało się załadować produktów");
        }
        if (partnersRes.ok) {
          const partnersData = await partnersRes.json();
          setPartners(partnersData);
        } else {
          setErrorMessage("Nie udało się załadować partnerów");
        }
        if (mapLocationsRes.ok) {
          const mapLocationsData = await mapLocationsRes.json();
          setMapLocations(mapLocationsData);
        } else {
          setErrorMessage("Nie udało się załadować punktów na mapie");
        }
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setPolishCities(citiesData);
        } else {
          const errorText = await citiesRes.text();
          console.error("Cities API error:", errorText);
          setErrorMessage(`Nie udało się załadować listy miast: ${citiesRes.status} ${errorText}`);
        }
      } catch (_error) {
        setErrorMessage("Błąd przy ładowaniu danych");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Error refreshing partners:", error);
    }
  };

  const refreshMapLocations = async () => {
    try {
      const res = await fetch("/api/map-locations");
      if (res.ok) {
        const data = await res.json();
        setMapLocations(data);
      }
    } catch (error) {
      console.error("Error refreshing map locations:", error);
    }
  };

  const handleAddMasterclass = async () => {
    // Sprawdzamy wymagane pola
    const missingFields = [];
    
    if (!newMasterclass.date) missingFields.push("Data rozpoczęcia");
    if (newMasterclass.dateType === "range" && !newMasterclass.dateEnd) missingFields.push("Data zakończenia");
    if (!newMasterclass.title?.pl) missingFields.push("Tytuł (polski)");
    if (!newMasterclass.title?.en && !usePolishForEnglish) missingFields.push("Tytuł (angielski)");
    if (!newMasterclass.description?.pl) missingFields.push("Opis (polski)");
    if (!newMasterclass.description?.en && !usePolishForEnglish) missingFields.push("Opis (angielski)");
    if (!newMasterclass.location?.pl) missingFields.push("Miejsce przeprowadzenia (polski)");
    if (!newMasterclass.location?.en && !usePolishForEnglish) missingFields.push("Miejsce przeprowadzenia (angielski)");
    if (!newMasterclass.city) missingFields.push("Miasto (dla mapy)");
    if (!newMasterclass.price) missingFields.push("Cena");
    if (!newMasterclass.availableSlots) missingFields.push("Dostępne miejsca");

    if (missingFields.length > 0) {
      setErrorMessage(`Proszę wypełnić wymagane pola: ${missingFields.join(", ")}`);
      return;
    }

    // Jeśli używamy polskiej wersji dla angielskiej, kopiujemy dane
      const masterclassToAdd: Masterclass = {
        ...newMasterclass,
        id: Date.now().toString(),
        pickedSlots: 0,
        faqs: newMasterclass.faqs || { pl: [], en: [] },
      title: {
        pl: newMasterclass.title?.pl || "",
        en: usePolishForEnglish ? newMasterclass.title?.pl || "" : newMasterclass.title?.en || ""
      },
      description: {
        pl: newMasterclass.description?.pl || "",
        en: usePolishForEnglish ? newMasterclass.description?.pl || "" : newMasterclass.description?.en || ""
      },
      location: {
        pl: newMasterclass.location?.pl || "",
        en: usePolishForEnglish ? newMasterclass.location?.pl || "" : newMasterclass.location?.en || ""
      },
      city: newMasterclass.city || ""
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
            city: "",
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
          setErrorMessage("Nie udało się dodać warsztatu");
        }
      } catch (_error) {
        setErrorMessage("Błąd przy dodawaniu warsztatu");
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
          setErrorMessage("Nie udało się zaktualizować warsztatu");
        }
      } catch (_error) {
        setErrorMessage("Błąd przy aktualizacji warsztatu");
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
        setErrorMessage("Nie udało się usunąć warsztatu");
      }
    } catch (_error) {
      setErrorMessage("Błąd przy usuwaniu warsztatu");
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
          setShowProductForm(false);
          setErrorMessage("");
          refreshOnlineProducts();
        } else {
          setErrorMessage("Nie udało się dodać produktu");
        }
      } catch (_error) {
        setErrorMessage("Błąd przy dodawaniu produktu");
      }
    } else {
      setErrorMessage("Proszę wypełnić pola dla wszystkich języków.");
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
          setErrorMessage("Nie udało się zaktualizować produktu");
        }
      } catch (_error) {
        setErrorMessage("Błąd przy aktualizacji produktu");
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
        setErrorMessage("Nie udało się usunąć produktu");
      }
    } catch (_error) {
      setErrorMessage("Błąd przy usuwaniu produktu");
    }
  };

  const handleAddPartner = async () => {
    if (!newPartner.name?.pl || !newPartner.description?.pl) {
      setErrorMessage("Proszę wypełnić wymagane pola");
      return;
    }

    const partnerToAdd: Partner = {
      ...newPartner,
      id: Date.now().toString(),
      name: {
        pl: newPartner.name?.pl || "",
        en: usePolishForEnglish ? newPartner.name?.pl || "" : newPartner.name?.en || ""
      },
      description: {
        pl: newPartner.description?.pl || "",
        en: usePolishForEnglish ? newPartner.description?.pl || "" : newPartner.description?.en || ""
      }
    } as Partner;

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerToAdd),
      });
      if (res.ok) {
        const addedPartner = await res.json();
        setPartners([...partners, addedPartner]);
        setNewPartner({
          name: { pl: "", en: "" },
          description: { pl: "", en: "" },
          logo: "",
          website: "",
          isActive: true,
        });
        setShowPartnerForm(false);
        setErrorMessage("");
        refreshPartners();
      } else {
        setErrorMessage("Nie udało się dodać partnera");
      }
    } catch (_error) {
      setErrorMessage("Błąd przy dodawaniu partnera");
    }
  };

  const handleEditPartner = async () => {
    if (editingPartner) {
      try {
        const res = await fetch(`/api/partners/${editingPartner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingPartner),
        });
        if (res.ok) {
          setPartners(partners.map((p) => (p.id === editingPartner.id ? editingPartner : p)));
          setEditingPartner(null);
          refreshPartners();
        } else {
          setErrorMessage("Nie udało się zaktualizować partnera");
        }
      } catch (_error) {
        setErrorMessage("Błąd przy aktualizacji partnera");
      }
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      const res = await fetch(`/api/partners/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPartners(partners.filter((p) => p.id !== id));
        refreshPartners();
      } else {
        setErrorMessage("Nie udało się usunąć partnera");
      }
    } catch (_error) {
      setErrorMessage("Błąd przy usuwaniu partnera");
    }
  };

  // Map Locations handlers
  const [newMapLocation, setNewMapLocation] = useState<Partial<MapLocation>>({
    city: "",
    name: { pl: "", en: "" },
    type: "other",
    photos: [],
    description: { pl: "", en: "" },
  });

  const handleAddMapLocation = async () => {
    if (!newMapLocation.city || !newMapLocation.name?.pl) {
      setErrorMessage("Proszę wypełnić wymagane pola: Miasto, Nazwa (polski)");
      return;
    }

    const locationToAdd: MapLocation = {
      ...newMapLocation,
      id: Date.now().toString(),
      photos: newMapLocation.photos || [],
    } as MapLocation;

    try {
      const res = await fetch("/api/map-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationToAdd),
      });
      if (res.ok) {
        const addedLocation = await res.json();
        setMapLocations([...mapLocations, addedLocation]);
        setNewMapLocation({
          city: "",
          name: { pl: "", en: "" },
          type: "other",
          photos: [],
          description: { pl: "", en: "" },
        });
        setShowMapLocationForm(false);
        setErrorMessage("");
        refreshMapLocations();
      } else {
        setErrorMessage("Nie udało się dodać punktu na mapie");
      }
    } catch (_error) {
      setErrorMessage("Błąd przy dodawaniu punktu na mapie");
    }
  };

  const handleEditMapLocation = async () => {
    if (editingMapLocation) {
      try {
        const res = await fetch(`/api/map-locations/${editingMapLocation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingMapLocation),
        });
        if (res.ok) {
          const updatedLocation = await res.json();
          setMapLocations(mapLocations.map((l) => (l.id === updatedLocation.id ? updatedLocation : l)));
          setEditingMapLocation(null);
          setErrorMessage("");
          refreshMapLocations();
        } else {
          setErrorMessage("Nie udało się zaktualizować punktu na mapie");
        }
      } catch (_error) {
        setErrorMessage("Błąd przy aktualizacji punktu na mapie");
      }
    }
  };

  const handleDeleteMapLocation = async (id: string) => {
    try {
      const res = await fetch(`/api/map-locations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMapLocations(mapLocations.filter((l) => l.id !== id));
        refreshMapLocations();
      } else {
        setErrorMessage("Nie udało się usunąć punktu na mapie");
      }
    } catch (_error) {
      setErrorMessage("Błąd przy usuwaniu punktu na mapie");
    }
  };

  const addPhotoToLocation = (location: MapLocation | Partial<MapLocation>, photoUrl: string): string[] => {
    if (!photoUrl.trim()) return location.photos || [];
    const currentPhotos = location.photos || [];
    if (!currentPhotos.includes(photoUrl)) {
      return [...currentPhotos, photoUrl];
    }
    return currentPhotos;
  };

  const removePhotoFromLocation = (location: MapLocation | Partial<MapLocation>, photoUrl: string): string[] => {
    return (location.photos || []).filter((p) => p !== photoUrl);
  };

  const uploadMapLocationPhotos = async (files: FileList | File[], target: "new" | "edit") => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setIsUploadingMapPhoto(true);
    setMapPhotoUploadError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload-map-photo", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url as string);
        }
      }

      if (uploadedUrls.length) {
        if (target === "new") {
          setNewMapLocation((prev) => ({
            ...prev,
            photos: [...(prev.photos || []), ...uploadedUrls],
          }));
        } else if (target === "edit" && editingMapLocation) {
          setEditingMapLocation({
            ...editingMapLocation,
            photos: [...(editingMapLocation.photos || []), ...uploadedUrls],
          });
        }
      }
    } catch (_error) {
      setMapPhotoUploadError("Nie udało się przesłać zdjęcia. Spróbuj ponownie.");
    } finally {
      setIsUploadingMapPhoto(false);
    }
  };

  const uploadMasterclassPhoto = async (
    files: FileList | File[],
    target: "new" | "edit"
  ) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    const file = fileArray[0];

    setIsUploadingMasterclassPhoto(true);
    setMasterclassPhotoUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-map-photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        if (target === "new") {
          setNewMasterclass((prev) => ({
            ...prev,
            photo: data.url as string,
          }));
        } else if (target === "edit" && editingMasterclass) {
          setEditingMasterclass({
            ...editingMasterclass,
            photo: data.url as string,
          });
        }
      }
    } catch (_error) {
      setMasterclassPhotoUploadError(
        "Nie udało się przesłać zdjęcia. Spróbuj ponownie."
      );
    } finally {
      setIsUploadingMasterclassPhoto(false);
    }
  };

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg border-2 border-black">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black">Panel administracyjny</h1>
          </div>
          <div className="flex gap-4 items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "pl" | "en")}
              className="bg-white text-black border-2 border-black rounded px-2 py-1"
            >
              <option value="pl">Polski</option>
              <option value="en">Angielski</option>
            </select>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              Wyloguj się
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              currentTab === "dashboard" 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-transparent text-black border-gray-300 hover:bg-gray-50 hover:border-black"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Pulpit
          </button>
          <button
            onClick={() => setCurrentTab("masterclasses")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              currentTab === "masterclasses" 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-transparent text-black border-gray-300 hover:bg-gray-50 hover:border-black"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Warsztaty
          </button>
          <button
            onClick={() => setCurrentTab("products")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              currentTab === "products" 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-transparent text-black border-gray-300 hover:bg-gray-50 hover:border-black"
            }`}
          >
            <Package className="w-4 h-4" />
            Produkty online
          </button>
          <button
            onClick={() => setCurrentTab("partners")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              currentTab === "partners" 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-transparent text-black border-gray-300 hover:bg-gray-50 hover:border-black"
            }`}
          >
            <Users className="w-4 h-4" />
            Partnerzy
          </button>
          <button
            onClick={() => setCurrentTab("mapLocations")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              currentTab === "mapLocations" 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-transparent text-black border-gray-300 hover:bg-gray-50 hover:border-black"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Punkty na mapie
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {currentTab === "dashboard" && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-semibold text-black">
                Pulpit
              </h2>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-black">Warsztaty</h3>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600">
                    Wszystkich warsztatów: <span className="font-bold text-black text-lg">{masterclasses.length}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Aktywnych: {masterclasses.filter(mc => {
                      const endDate = new Date(mc.dateEnd || mc.date);
                      endDate.setHours(23, 59, 59, 999);
                      return endDate >= new Date();
                    }).length}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab("masterclasses")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Zarządzaj warsztatami
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-black">Produkty online</h3>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600">
                    Wszystkich produktów: <span className="font-bold text-black text-lg">{onlineProducts.length}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Kursów: {onlineProducts.filter(p => p.type === 'course').length} | 
                    Konsultacji: {onlineProducts.filter(p => p.type === 'consultation').length}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab("products")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Zarządzaj produktami
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-black">Partnerzy</h3>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600">
                    Wszystkich partnerów: <span className="font-bold text-black text-lg">{partners.length}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Aktywnych: {partners.filter(p => p.isActive).length}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab("partners")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Zarządzaj partnerami
                </button>
              </div>
            </div>

            {/* Recent Masterclasses */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-black">Ostatnie warsztaty</h3>
              </div>
              <div className="space-y-3">
                {masterclasses.slice(0, 3).map((masterclass) => (
                  <div key={masterclass.id} className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-black text-lg mb-2">{masterclass.title[language]}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {masterclass.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {masterclass.price} zł
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {masterclass.availableSlots - masterclass.pickedSlots} miejsc
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingMasterclass(masterclass)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edytuj
                      </button>
                    </div>
                  </div>
                ))}
                {masterclasses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Brak warsztatów</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Products */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-black">Ostatnie produkty</h3>
              </div>
              <div className="space-y-3">
                {onlineProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-black text-lg mb-2">{product.title[language]}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {product.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {product.price} zł
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edytuj
                      </button>
                    </div>
                  </div>
                ))}
                {onlineProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Brak produktów</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Partners */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-black">Ostatni partnerzy</h3>
              </div>
              <div className="space-y-3">
                {partners.slice(0, 3).map((partner) => (
                  <div key={partner.id} className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-black text-lg mb-2">{partner.name[language]}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {partner.website ? 'Strona internetowa' : 'Brak strony'}
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className={`w-4 h-4 ${partner.isActive ? 'text-green-500' : 'text-red-500'}`} />
                            {partner.isActive ? 'Aktywny' : 'Nieaktywny'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edytuj
                      </button>
                    </div>
                  </div>
                ))}
                {partners.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Brak partnerów</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === "masterclasses" && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-black">
                Warsztaty
            </h2>
            </div>
            {showMasterclassForm && (
              <div className="space-y-4">
                {/* Language Options */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Ustawienia języków</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Wybierz język edycji poniżej. Możesz skopiować polską wersję na angielską.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setLanguage("pl")}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        language === "pl" 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      Polski
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        language === "en" 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      English
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-blue-700 text-sm mt-3">
                    <input
                      type="checkbox"
                      checked={usePolishForEnglish}
                      onChange={(e) => setUsePolishForEnglish(e.target.checked)}
                      className="rounded"
                    />
                    Skopiuj polską wersję na angielską
                  </label>
                </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black mb-1">Typ daty</label>
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
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                  >
                    <option value="single">Jeden dzień</option>
                    <option value="range">Okres</option>
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
                    <label className="block text-black mb-1">
                      Data rozpoczęcia
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
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    />
                  </div>
                  {newMasterclass.dateType === "range" && (
                    <div>
                      <label className="block text-black mb-1">
                        Data zakończenia
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      Miejsce przeprowadzenia
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        language === "pl" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {language === "pl" ? "Polski" : "English"}
                      </span>
                      {language === "en" && usePolishForEnglish && (
                        <span className="text-orange-600 text-xs">(będzie skopiowane z polskiego)</span>
                      )}
                    </div>
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
                    className={`w-full px-3 py-2 border-2 border-black rounded bg-white text-black ${
                      language === "en" && usePolishForEnglish ? "opacity-50" : ""
                    }`}
                    placeholder="Miejsce przeprowadzenia"
                    disabled={language === "en" && usePolishForEnglish}
                  />
                </div>
                
                {/* City Field */}
                <div>
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      Miasto (dla mapy)
                      <span className="text-xs text-gray-500">(wybierz miasto z listy)</span>
                    </div>
                  </label>
                  <select
                    value={newMasterclass.city || ""}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                  >
                    <option value="">Wybierz miasto</option>
                    {polishCities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-gray-600" />
                      Tytuł warsztatu
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        language === "pl" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {language === "pl" ? "Polski" : "English"}
                      </span>
                      {language === "en" && usePolishForEnglish && (
                        <span className="text-orange-600 text-xs">(będzie skopiowane z polskiego)</span>
                      )}
                    </div>
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
                    className={`w-full px-3 py-2 border-2 border-black rounded bg-white text-black ${
                      language === "en" && usePolishForEnglish ? "opacity-50" : ""
                    }`}
                    placeholder="Tytuł"
                    disabled={language === "en" && usePolishForEnglish}
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-gray-600" />
                      Opis warsztatu
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        language === "pl" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {language === "pl" ? "Polski" : "English"}
                      </span>
                      {language === "en" && usePolishForEnglish && (
                        <span className="text-orange-600 text-xs">(będzie skopiowane z polskiego)</span>
                      )}
                    </div>
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
                    className={`w-full px-3 py-2 border-2 border-black rounded bg-white text-black ${
                      language === "en" && usePolishForEnglish ? "opacity-50" : ""
                    }`}
                    placeholder="Opis"
                    rows={4}
                    disabled={language === "en" && usePolishForEnglish}
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">Cena (zł)</label>
                  <input
                    type="number"
                    value={newMasterclass.price || 0}
                    onChange={(e) =>
                      setNewMasterclass({
                        ...newMasterclass,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    placeholder="Cena (zł)"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">
                    Dostępne miejsca
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
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    placeholder="Dostępne miejsca"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">
                    Zdjęcie warsztatu
                    <span className="block text-xs text-gray-500">
                      Przeciągnij i upuść zdjęcie lub wybierz je z dysku.
                    </span>
                  </label>
                  <div
                    className="mt-1 flex flex-col gap-2"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        uploadMasterclassPhoto(e.dataTransfer.files, "new");
                      }
                    }}
                  >
                    <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center cursor-pointer hover:border-black hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-black">
                        Przeciągnij i upuść zdjęcie tutaj
                      </span>
                      <span className="text-xs text-gray-500">
                        lub kliknij, aby wybrać z dysku
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            uploadMasterclassPhoto(e.target.files, "new");
                          }
                        }}
                      />
                    </label>
                    {isUploadingMasterclassPhoto && (
                      <p className="text-xs text-gray-500">
                        Przesyłanie zdjęcia...
                      </p>
                    )}
                    {masterclassPhotoUploadError && (
                      <p className="text-xs text-red-500">
                        {masterclassPhotoUploadError}
                      </p>
                    )}
                  </div>
                  {newMasterclass.photo && (
                    <div className="mt-3 w-full max-w-xs">
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                        <Image
                          src={newMasterclass.photo}
                          alt="Podgląd zdjęcia warsztatu"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-gray-600" />
                      Najczęściej zadawane pytania (FAQ)
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        language === "pl" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {language === "pl" ? "Polski" : "English"}
                      </span>
                    </div>
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newFaq.question}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, question: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Pytanie"
                      />
                      <input
                        type="text"
                        value={newFaq.answer}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, answer: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Odpowiedź"
                      />
                    </div>
                    <button
                      onClick={() => addFaq(setNewMasterclass)}
                      className="px-4 py-2 rounded border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Dodaj FAQ
                    </button>
                    {newMasterclass.faqs?.[language]?.map((faq) => (
                      <div
                        key={faq.id}
                        className="flex justify-between items-center p-2 bg-gray-100 border border-gray-300 rounded"
                      >
                        <div>
                          <p className="text-gray-100">
                            <strong>Pytanie:</strong> {faq.question}
                          </p>
                          <p className="text-gray-600">
                            <strong>Odpowiedź:</strong> {faq.answer}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeFaq(faq.id, setNewMasterclass, language)
                          }
                          className="px-3 py-1 rounded border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
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
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Dodaj warsztat
              </button>
            </div>
            )}

            <hr className="border-gray-300 mt-4" />
            
            {/* Add Masterclass Button */}
            <div className="mt-6 mb-4">
              <button
                onClick={() => setShowMasterclassForm(!showMasterclassForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                {showMasterclassForm ? 'Ukryj formularz' : 'Dodaj warsztat'}
              </button>
            </div>

            {/* Masterclass List */}
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-gray-300">Ładowanie...</p>
              ) : !masterclasses.length ? (
                <p className="text-gray-300">Brak</p>
              ) : (
                masterclasses.map((masterclass) => (
                  <div
                    key={masterclass.id}
                    className="flex justify-between items-center p-4 bg-gray-50 border-2 border-gray-300 rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={masterclass.photo}
                          alt="Masterclass"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-black font-semibold">
                          {masterclass.title[language]}
                        </h3>
                        <p className="text-gray-600">
                          {masterclass.dateType === "single"
                            ? `${masterclass.date}`
                            : `${masterclass.date} - ${masterclass.dateEnd}`}{" "}
                          | {masterclass.location[language]} |{" "}
                          {masterclass.price} zł | {masterclass.availableSlots}{" "}
                          miejsc | Zarezerwowano: {masterclass.pickedSlots}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMasterclass(masterclass)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                        title="Edytuj"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMasterclass(masterclass.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
                        title="Usuń"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Edit Masterclass Modal */}
            {editingMasterclass && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-[800px] border-2 border-black">
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Edytuj warsztat
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-black mb-1">
                        Typ daty
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      >
                        <option value="single">Jeden dzień</option>
                        <option value="range">Okres</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Data rozpoczęcia
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      />
                    </div>
                    {editingMasterclass.dateType === "range" && (
                      <div>
                        <label className="block text-black mb-1">
                          Data zakończenia
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
                          className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-black mb-1">
                        Miejsce przeprowadzenia (
                        {language === "pl" ? "Polski" : "Angielski"})
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Miejsce przeprowadzenia"
                      />
                    </div>
                    
                    {/* City Field */}
                    <div>
                      <label className="block text-black mb-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          Miasto (dla mapy)
                        </div>
                      </label>
                      <select
                        value={editingMasterclass.city || ""}
                        onChange={(e) =>
                          setEditingMasterclass({
                            ...editingMasterclass,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      >
                        <option value="">Wybierz miasto</option>
                        {polishCities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-black mb-1">
                        Tytuł (
                        {language === "pl" ? "Polski" : "Angielski"})
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Tytuł"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Opis ({language === "pl" ? "Polski" : "Angielski"})
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Opis"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Cena (zł)
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Cena (zł)"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Dostępne miejsca
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Dostępne miejsca"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Zdjęcie warsztatu
                        <span className="block text-xs text-gray-500">
                          Przeciągnij i upuść zdjęcie lub wybierz je z dysku.
                        </span>
                      </label>
                      <div
                        className="mt-1 flex flex-col gap-2"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            uploadMasterclassPhoto(e.dataTransfer.files, "edit");
                          }
                        }}
                      >
                        <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center cursor-pointer hover:border-black hover:bg-gray-100 transition-colors">
                          <span className="text-sm font-medium text-black">
                            Przeciągnij i upuść zdjęcie tutaj
                          </span>
                          <span className="text-xs text-gray-500">
                            lub kliknij, aby wybrać z dysku
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                uploadMasterclassPhoto(e.target.files, "edit");
                              }
                            }}
                          />
                        </label>
                        {isUploadingMasterclassPhoto && (
                          <p className="text-xs text-gray-500">
                            Przesyłanie zdjęcia...
                          </p>
                        )}
                        {masterclassPhotoUploadError && (
                          <p className="text-xs text-red-500">
                            {masterclassPhotoUploadError}
                          </p>
                        )}
                      </div>
                      {editingMasterclass.photo && (
                        <div className="mt-3 w-full max-w-xs">
                          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <Image
                              src={editingMasterclass.photo}
                              alt="Podgląd zdjęcia warsztatu"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Zarezerwowane miejsca
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Zarezerwowane miejsca"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-black mb-1">
                        FAQ ({language === "pl" ? "Polski" : "Angielski"})
                      </label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newFaq.question}
                            onChange={(e) =>
                              setNewFaq({ ...newFaq, question: e.target.value })
                            }
                            className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                            placeholder="Pytanie"
                          />
                          <input
                            type="text"
                            value={newFaq.answer}
                            onChange={(e) =>
                              setNewFaq({ ...newFaq, answer: e.target.value })
                            }
                            className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                            placeholder="Odpowiedź"
                          />
                        </div>
                        <button
                          onClick={() => addFaq(setEditingMasterclass)}
                          className="px-4 py-2 rounded border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Plus size={20} />
                          Dodaj FAQ
                        </button>
                        {editingMasterclass.faqs?.[language]?.map((faq) => (
                          <div
                            key={faq.id}
                            className="flex justify-between items-center p-2 bg-gray-100 border border-gray-300 rounded"
                          >
                            <div>
                              <p className="text-gray-100">
                                <strong>Pytanie:</strong> {faq.question}
                              </p>
                              <p className="text-gray-600">
                                <strong>Odpowiedź:</strong> {faq.answer}
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
                              className="px-3 py-1 rounded border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
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
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-all duration-200 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Anuluj
                    </button>
                    <button
                      onClick={handleEditMasterclass}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "products" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-black">
              Produkty online
            </h2>
            </div>
            {showProductForm && (
              <div className="space-y-4">
                {/* Language Options for Products */}
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Ustawienia języków</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Wybierz język edycji poniżej. Możesz skopiować polską wersję na angielską.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setLanguage("pl")}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        language === "pl" 
                          ? "bg-green-600 text-white border-green-600" 
                          : "bg-white text-green-600 border-green-300 hover:bg-green-50"
                      }`}
                    >
                      Polski
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        language === "en" 
                          ? "bg-green-600 text-white border-green-600" 
                          : "bg-white text-green-600 border-green-300 hover:bg-green-50"
                      }`}
                    >
                      English
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-green-700 text-sm mt-3">
                    <input
                      type="checkbox"
                      checked={usePolishForEnglish}
                      onChange={(e) => setUsePolishForEnglish(e.target.checked)}
                      className="rounded"
                    />
                    Skopiuj polską wersję na angielską
                  </label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black mb-1">
                    Typ produktu
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
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                  >
                    <option value="course">Kurs</option>
                    <option value="consultation">Konsultacja</option>
                    <option value="recipe">Książka przepisów</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-gray-600" />
                      Tytuł produktu
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        language === "pl" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {language === "pl" ? "Polski" : "English"}
                      </span>
                    </div>
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
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    placeholder="Tytuł produktu"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-gray-600" />
                      Opis produktu
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        language === "pl" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {language === "pl" ? "Polski" : "English"}
                      </span>
                    </div>
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
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    placeholder="Opis produktu"
                    rows={1}
                  />
                </div>
                <div>
                  <label className="block text-black mb-1">Cena (zł)</label>
                  <input
                    type="number"
                    value={newProduct.price || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    placeholder="Cena (zł)"
                  />
                </div>
              </div>
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Dodaj produkt
              </button>
            </div>
            )}
            <hr className="border-gray-300 mt-4" />
            
            {/* Add Product Button */}
            <div className="mt-6 mb-4">
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                {showProductForm ? 'Ukryj formularz' : 'Dodaj produkt'}
              </button>
            </div>

            {/* Online Products List */}
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-gray-300">Ładowanie...</p>
              ) : !onlineProducts.length ? (
                <p className="text-gray-300">Brak</p>
              ) : (
                onlineProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-4 bg-gray-50 border-2 border-gray-300 rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={product.photo}
                          alt="Product"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-black font-semibold">
                          {product.title[language]}
                        </h3>
                        <p className="text-gray-600">
                          {product.type === "course"
                            ? "Kurs"
                            : product.type === "consultation"
                            ? "Konsultacja"
                            : "Książka przepisów"}{" "}
                          | {product.price} zł
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                        title="Edytuj"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
                        title="Usuń"
                      >
                        <Trash2 className="w-4 h-4" />
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
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Edytuj produkt
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-black mb-1">
                        Typ produktu
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      >
                        <option value="course">Kurs</option>
                        <option value="consultation">Konsultacja</option>
                        <option value="recipe">Książka przepisów</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Tytuł (
                        {language === "pl" ? "Polski" : "Angielski"})
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Tytuł"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Opis ({language === "pl" ? "Polski" : "Angielski"})
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Opis"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Cena (zł)
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
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Cena (zł)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-all duration-200 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Anuluj
                    </button>
                    <button
                      onClick={handleEditProduct}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "partners" && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-black">
                Partnerzy
              </h2>
            </div>
            
            {showPartnerForm && (
              <div className="space-y-4">
                {/* Language Options for Partners */}
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800">Ustawienia języków</h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">
                    Wybierz język edycji poniżej. Możesz skopiować polską wersję na angielską.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setLanguage("pl")}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        language === "pl" 
                          ? "bg-purple-600 text-white border-purple-600" 
                          : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      Polski
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        language === "en" 
                          ? "bg-purple-600 text-white border-purple-600" 
                          : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      English
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-purple-700 text-sm mt-3">
                    <input
                      type="checkbox"
                      checked={usePolishForEnglish}
                      onChange={(e) => setUsePolishForEnglish(e.target.checked)}
                      className="rounded"
                    />
                    Skopiuj polską wersję na angielską
                  </label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black mb-1">
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-gray-600" />
                        Nazwa partnera
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          language === "pl" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {language === "pl" ? "Polski" : "English"}
                        </span>
                      </div>
                    </label>
                        <input
                      type="text"
                      value={newPartner.name?.[language] || ""}
                          onChange={(e) =>
                        setNewPartner({
                          ...newPartner,
                          name: {
                            pl: language === "pl" ? e.target.value : newPartner.name?.pl || "",
                            en: language === "en" ? e.target.value : newPartner.name?.en || "",
                          },
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      placeholder="Nazwa partnera"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-gray-600" />
                        Opis partnera
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          language === "pl" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {language === "pl" ? "Polski" : "English"}
                        </span>
                      </div>
                    </label>
                    <textarea
                      value={newPartner.description?.[language] || ""}
                      onChange={(e) =>
                        setNewPartner({
                          ...newPartner,
                          description: {
                            pl: language === "pl" ? e.target.value : newPartner.description?.pl || "",
                            en: language === "en" ? e.target.value : newPartner.description?.en || "",
                          },
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      placeholder="Opis partnera"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">URL logo</label>
                    <input
                      type="text"
                      value={newPartner.logo || ""}
                      onChange={(e) =>
                        setNewPartner({
                          ...newPartner,
                          logo: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      placeholder="URL logo"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Strona internetowa</label>
                    <input
                      type="text"
                      value={newPartner.website || ""}
                      onChange={(e) =>
                        setNewPartner({
                          ...newPartner,
                          website: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddPartner}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj partnera
                </button>
              </div>
            )}

            <hr className="border-gray-300 mt-4" />
            
            {/* Add Partner Button */}
            <div className="mt-6 mb-4">
              <button
                onClick={() => setShowPartnerForm(!showPartnerForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                {showPartnerForm ? 'Ukryj formularz' : 'Dodaj partnera'}
              </button>
            </div>

            {/* Partners List */}
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-gray-300">Ładowanie...</p>
              ) : !partners.length ? (
                <p className="text-gray-300">Brak partnerów</p>
              ) : (
                partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex justify-between items-center p-4 bg-gray-50 border-2 border-gray-300 rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt="Partner logo"
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-black font-semibold">
                          {partner.name[language]}
                        </h3>
                        <p className="text-gray-600">
                          {partner.website ? 'Strona internetowa' : 'Brak strony'} | 
                          {partner.isActive ? ' Aktywny' : ' Nieaktywny'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                        title="Edytuj"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
                        title="Usuń"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Edit Partner Modal */}
            {editingPartner && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Edytuj partnera
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-black mb-1">
                        Nazwa partnera ({language === "pl" ? "Polski" : "Angielski"})
                      </label>
                      <input
                        type="text"
                        value={editingPartner.name[language]}
                        onChange={(e) =>
                          setEditingPartner({
                            ...editingPartner,
                            name: {
                              ...editingPartner.name,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Nazwa partnera"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">
                        Opis ({language === "pl" ? "Polski" : "Angielski"})
                      </label>
                      <textarea
                        value={editingPartner.description[language]}
                        onChange={(e) =>
                          setEditingPartner({
                            ...editingPartner,
                            description: {
                              ...editingPartner.description,
                              [language]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="Opis"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">URL logo</label>
                      <input
                        type="text"
                        value={editingPartner.logo}
                        onChange={(e) =>
                          setEditingPartner({
                            ...editingPartner,
                            logo: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="URL logo"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">Strona internetowa</label>
                      <input
                        type="text"
                        value={editingPartner.website || ""}
                        onChange={(e) =>
                          setEditingPartner({
                            ...editingPartner,
                            website: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setEditingPartner(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-all duration-200 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Anuluj
                    </button>
                    <button
                      onClick={handleEditPartner}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "mapLocations" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-black">
                  Punkty na mapie
                </h2>
              </div>
              <button
                onClick={() => setShowMapLocationForm(!showMapLocationForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                {showMapLocationForm ? "Anuluj" : "Dodaj punkt"}
              </button>
            </div>

            {showMapLocationForm && (
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Nowy punkt na mapie</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black mb-1">Miasto *</label>
                    <select
                      value={newMapLocation.city || ""}
                      onChange={(e) =>
                        setNewMapLocation({
                          ...newMapLocation,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    >
                      <option value="">Wybierz miasto</option>
                      {polishCities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-black mb-1">Typ miejsca</label>
                    <select
                      value={newMapLocation.type || "other"}
                      onChange={(e) =>
                        setNewMapLocation({
                          ...newMapLocation,
                          type: e.target.value as "school" | "bakery" | "private_client" | "other",
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                    >
                      <option value="school">Szkoła</option>
                      <option value="bakery">Piekarnia</option>
                      <option value="private_client">Klient prywatny</option>
                      <option value="other">Inne</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-black mb-1">Nazwa miejsca (polski) *</label>
                    <input
                      type="text"
                      value={newMapLocation.name?.pl || ""}
                      onChange={(e) =>
                        setNewMapLocation({
                          ...newMapLocation,
                          name: {
                            pl: e.target.value,
                            en: newMapLocation.name?.en || "",
                          },
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      placeholder="Nazwa miejsca"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Nazwa miejsca (angielski)</label>
                    <input
                      type="text"
                      value={newMapLocation.name?.en || ""}
                      onChange={(e) =>
                        setNewMapLocation({
                          ...newMapLocation,
                          name: {
                            pl: newMapLocation.name?.pl || "",
                            en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      placeholder="Place name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">Opis (polski)</label>
                    <textarea
                      value={newMapLocation.description?.pl || ""}
                      onChange={(e) =>
                        setNewMapLocation({
                          ...newMapLocation,
                          description: {
                            pl: e.target.value,
                            en: newMapLocation.description?.en || "",
                          },
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      rows={3}
                      placeholder="Opis miejsca"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">Opis (angielski)</label>
                    <textarea
                      value={newMapLocation.description?.en || ""}
                      onChange={(e) =>
                        setNewMapLocation({
                          ...newMapLocation,
                          description: {
                            pl: newMapLocation.description?.pl || "",
                            en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      rows={3}
                      placeholder="Place description"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">
                      Zdjęcia z warsztatów
                      <span className="block text-xs text-gray-500">
                        Przeciągnij i upuść zdjęcia lub wybierz je z dysku. Możesz dodać kilka zdjęć.
                      </span>
                    </label>
                    <div
                      className="mt-1 flex flex-col gap-2"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          uploadMapLocationPhotos(e.dataTransfer.files, "new");
                        }
                      }}
                    >
                      <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center cursor-pointer hover:border-black hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-black">
                          Przeciągnij i upuść zdjęcia tutaj
                        </span>
                        <span className="text-xs text-gray-500">
                          lub kliknij, aby wybrać z dysku
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              uploadMapLocationPhotos(e.target.files, "new");
                            }
                          }}
                        />
                      </label>
                      {isUploadingMapPhoto && (
                        <p className="text-xs text-gray-500">
                          Przesyłanie zdjęć...
                        </p>
                      )}
                      {mapPhotoUploadError && (
                        <p className="text-xs text-red-500">
                          {mapPhotoUploadError}
                        </p>
                      )}
                    </div>
                    {newMapLocation.photos && newMapLocation.photos.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {newMapLocation.photos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={photo}
                              alt={`Podgląd zdjęcia ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => {
                                const updatedPhotos = removePhotoFromLocation(newMapLocation, photo);
                                setNewMapLocation({ ...newMapLocation, photos: updatedPhotos });
                              }}
                              className="absolute top-1 right-1 px-1.5 py-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                              type="button"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleAddMapLocation}
                  className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj punkt na mapie
                </button>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-gray-300">Ładowanie...</p>
              ) : !mapLocations.length ? (
                <p className="text-gray-300">Brak punktów na mapie</p>
              ) : (
                mapLocations.map((location) => (
                  <div
                    key={location.id}
                    className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-black text-lg mb-2">
                          {location.name[language]} - {location.city}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                          <span>Typ: {
                            location.type === "school" ? "Szkoła" :
                            location.type === "bakery" ? "Piekarnia" :
                            location.type === "private_client" ? "Klient prywatny" :
                            "Inne"
                          }</span>
                          <span>Zdjęć: {location.photos.length}</span>
                        </div>
                        {location.description[language] && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {location.description[language]}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingMapLocation(location)}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium"
                          title="Edytuj"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMapLocation(location.id)}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
                          title="Usuń"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Edit Map Location Modal */}
            {editingMapLocation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Edytuj punkt na mapie
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black mb-1">Miasto *</label>
                      <select
                        value={editingMapLocation.city}
                        onChange={(e) =>
                          setEditingMapLocation({
                            ...editingMapLocation,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      >
                        <option value="">Wybierz miasto</option>
                        {polishCities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-black mb-1">Typ miejsca</label>
                      <select
                        value={editingMapLocation.type}
                        onChange={(e) =>
                          setEditingMapLocation({
                            ...editingMapLocation,
                            type: e.target.value as "school" | "bakery" | "private_client" | "other",
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      >
                        <option value="school">Szkoła</option>
                        <option value="bakery">Piekarnia</option>
                        <option value="private_client">Klient prywatny</option>
                        <option value="other">Inne</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-black mb-1">Nazwa miejsca (polski) *</label>
                      <input
                        type="text"
                        value={editingMapLocation.name.pl}
                        onChange={(e) =>
                          setEditingMapLocation({
                            ...editingMapLocation,
                            name: {
                              ...editingMapLocation.name,
                              pl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-1">Nazwa miejsca (angielski)</label>
                      <input
                        type="text"
                        value={editingMapLocation.name.en}
                        onChange={(e) =>
                          setEditingMapLocation({
                            ...editingMapLocation,
                            name: {
                              ...editingMapLocation.name,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-black mb-1">Opis (polski)</label>
                      <textarea
                        value={editingMapLocation.description.pl}
                        onChange={(e) =>
                          setEditingMapLocation({
                            ...editingMapLocation,
                            description: {
                              ...editingMapLocation.description,
                              pl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-black mb-1">Opis (angielski)</label>
                      <textarea
                        value={editingMapLocation.description.en}
                        onChange={(e) =>
                          setEditingMapLocation({
                            ...editingMapLocation,
                            description: {
                              ...editingMapLocation.description,
                              en: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-black mb-1">
                        Zdjęcia z warsztatów
                        <span className="block text-xs text-gray-500">
                          Przeciągnij i upuść zdjęcia lub wybierz je z dysku. Możesz dodać kilka zdjęć.
                        </span>
                      </label>
                      <div
                        className="mt-1 flex flex-col gap-2"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            uploadMapLocationPhotos(e.dataTransfer.files, "edit");
                          }
                        }}
                      >
                        <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center cursor-pointer hover:border-black hover:bg-gray-100 transition-colors">
                          <span className="text-sm font-medium text-black">
                            Przeciągnij i upuść zdjęcia tutaj
                          </span>
                          <span className="text-xs text-gray-500">
                            lub kliknij, aby wybrać z dysku
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                uploadMapLocationPhotos(e.target.files, "edit");
                              }
                            }}
                          />
                        </label>
                        {isUploadingMapPhoto && (
                          <p className="text-xs text-gray-500">
                            Przesyłanie zdjęć...
                          </p>
                        )}
                        {mapPhotoUploadError && (
                          <p className="text-xs text-red-500">
                            {mapPhotoUploadError}
                          </p>
                        )}
                      </div>
                      {editingMapLocation.photos.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {editingMapLocation.photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                              <Image
                                src={photo}
                                alt={`Podgląd zdjęcia ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                onClick={() => {
                                  const updatedPhotos = removePhotoFromLocation(editingMapLocation, photo);
                                  setEditingMapLocation({ ...editingMapLocation, photos: updatedPhotos });
                                }}
                                className="absolute top-1 right-1 px-1.5 py-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                                type="button"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setEditingMapLocation(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-all duration-200 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Anuluj
                    </button>
                    <button
                      onClick={handleEditMapLocation}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Zapisz
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
        setError("Nieprawidłowy login lub hasło");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-color)] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-7 md:space-y-8 bg-[var(--accent-color)] p-6 sm:p-7 md:p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-brown">
            Panel administracyjny
          </h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-sm text-gray-300">
            Wprowadź swoje dane logowania, aby uzyskać dostęp do panelu administracyjnego
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
                Login
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded relative block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-brown placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-brown focus:border-brown focus:z-10 text-xs sm:text-sm md:text-sm bg-[var(--accent-color)]"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-100 mb-1">
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded relative block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-brown placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-brown focus:border-brown focus:z-10 text-xs sm:text-sm md:text-sm bg-[var(--accent-color)]"
                placeholder="Hasło"
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
              className="btn-unified w-full disabled:opacity-50"
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
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
