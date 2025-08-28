export interface OnlineProduct {
  id: string;
  type: "course" | "consultation" | "recipe";
  title: {
    pl: string;
    en: string;
  };
  description: {
    pl: string;
    en: string;
  };
  price: number;
  photo: string;
}
