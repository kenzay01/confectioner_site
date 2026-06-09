import type { SiteContentFontFamily } from "@/types/siteContent";
import { getSiteFontStack } from "@/lib/siteFont";

type Props = {
  value: SiteContentFontFamily;
  onChange: (value: SiteContentFontFamily) => void;
  label?: string;
  hint?: string;
};

export function FontFamilySelect({
  value,
  onChange,
  label = "Czcionka tekstu warsztatu",
  hint = "Dotyczy tytułu, opisu i FAQ na stronie tego warsztatu.",
}: Props) {
  return (
    <div>
      <label className="block text-black mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SiteContentFontFamily)}
        style={{ fontFamily: getSiteFontStack(value) }}
        className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
      >
        <optgroup label="Klasyczne bezszeryfowe">
          <option value="montserrat">Montserrat</option>
          <option value="lato">Lato</option>
          <option value="openSans">Open Sans</option>
          <option value="roboto">Roboto</option>
        </optgroup>
        <optgroup label="Nowoczesne bezszeryfowe">
          <option value="dmSans">DM Sans</option>
          <option value="plusJakartaSans">Plus Jakarta Sans</option>
          <option value="nunito">Nunito</option>
          <option value="raleway">Raleway</option>
          <option value="workSans">Work Sans</option>
        </optgroup>
        <optgroup label="Szeryfowe / eleganckie">
          <option value="playfairDisplay">Playfair Display</option>
          <option value="merriweather">Merriweather</option>
          <option value="literata">Literata</option>
        </optgroup>
      </select>
      {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}
