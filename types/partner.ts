export interface Partner {
  id: string;
  name: {
    pl: string;
    en: string;
  };
  description: {
    pl: string;
    en: string;
  };
  logo: string;
  website?: string;
  isActive: boolean;
}
