export interface MapLocation {
  id: string;
  city: string; // Місто для відображення на мапі
  name: {
    pl: string;
    en: string;
  };
  type: "school" | "bakery" | "private_client" | "cukiernia" | "kawiarnia" | "other"; // Тип місця
  photos: string[]; // Масив URL фото
  description: {
    pl: string;
    en: string;
  };
}

