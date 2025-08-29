"use client";
import { useState } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Instagram, Send, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import sweet1 from "@/public/materials/bread2.png";
import sweet2 from "@/public/materials/sweet4.png";

export default function Contact() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    email: "",
    question: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Placeholder for form submission logic
    console.log("Form submitted:", formData);
  };

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)] overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Image
          src={sweet1}
          alt="Sweet 1"
          width={400}
          height={400}
          className="absolute -left-25 sm:-left-40 lg:-left-85 z-15 -rotate-15 top-15 md:top-20 lg:top-15 drop-shadow-2xl w-48 h-48 sm:w-68 sm:h-68 lg:w-96 lg:h-96"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        />
        <Image
          src={sweet2}
          alt="Sweet 2"
          width={400}
          height={400}
          className="absolute -right-20 sm:-right-40 lg:-right-85 z-15 rotate-10 bottom-30 md:bottom-20 lg:bottom-0 drop-shadow-2xl w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-8 text-center">
          {currentLocale === "pl" ? "Kontakt" : "Contact"}
        </h1>
        <div className="grid grid-cols-1 gap-8 mb-12 z-20">
          {/* Left: Contact Message */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10 z-20">
            <p className="text-[var(--brown-color)]">
              {currentLocale === "pl"
                ? "Z przyjemnością odpowiem na wszystkie Twoje pytania. Zostaw swoje dane poniżej, a skontaktuję się z Tobą jak najszybciej:"
                : "I’ll be happy to answer all your questions. Leave your details below, and I’ll get back to you as soon as possible:"}
            </p>
          </div>
          {/* Right: Contact Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10">
            <div id="contact-form" className="space-y-4">
              <div>
                <label className="block text-[var(--brown-color)] font-medium mb-1">
                  {currentLocale === "pl" ? "Imię" : "Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder={
                    currentLocale === "pl" ? "Twoje imię" : "Your name"
                  }
                />
              </div>
              <div>
                <label className="block text-[var(--brown-color)] font-medium mb-1">
                  {currentLocale === "pl"
                    ? "Nick w Telegramie"
                    : "Telegram Username"}
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder={
                    currentLocale === "pl" ? "@TwójNick" : "@YourUsername"
                  }
                />
              </div>
              <div>
                <label className="block text-[var(--brown-color)] font-medium mb-1">
                  {currentLocale === "pl" ? "Poczta" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  placeholder={
                    currentLocale === "pl" ? "Twój email" : "Your email"
                  }
                />
              </div>
              <div>
                <label className="block text-[var(--brown-color)] font-medium mb-1">
                  {currentLocale === "pl" ? "Pytanie" : "Question"}
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  rows={4}
                  placeholder={
                    currentLocale === "pl" ? "Twoje pytanie" : "Your question"
                  }
                />
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {currentLocale === "pl" ? "Wyślij" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center">
          <p className="text-[var(--brown-color)] mb-4">
            {currentLocale === "pl"
              ? "Śledź mnie, aby być na bieżąco z warsztatami i nowościami ze świata piekarnictwa:"
              : "Follow me to stay updated on workshops and baking news:"}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="https://instagram.com/slaviksemkiv"
              target="_blank"
              className="flex items-center gap-2 text-[var(--brown-color)] hover:text-[var(--accent-color)] transition-colors"
            >
              <Instagram className="w-6 h-6" />
              slaviksemkiv
            </Link>
            <Link
              href="https://t.me/slaviksemkiv" // Replace with actual Telegram link
              target="_blank"
              className="flex items-center gap-2 text-[var(--brown-color)] hover:text-[var(--accent-color)] transition-colors"
            >
              <Send className="w-6 h-6" />
              Telegram
            </Link>
            <Link
              href="https://wa.me/1234567890" // Replace with actual WhatsApp link
              target="_blank"
              className="flex items-center gap-2 text-[var(--brown-color)] hover:text-[var(--accent-color)] transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
