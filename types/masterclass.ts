export interface Masterclass {
  id: string;
  dateType: "single" | "range";
  date: string;
  dateEnd?: string;
  //   startTime?: string;
  dateTimes?: { id: string; date: string; time: string }[];
  location: {
    pl: string;
    en: string;
  };
  city: string; // Місто для відображення на мапі
  title: {
    pl: string;
    en: string;
  };
  photo: string;
  description: {
    pl: string;
    en: string;
  };
  price: number;
  availableSlots: number;
  pickedSlots: number;
  faqs: {
    pl: { id: string; question: string; answer: string }[];
    en: { id: string; question: string; answer: string }[];
  };
}
