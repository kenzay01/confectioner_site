"use client";
import { useState } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Instagram, Send, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import sweet1 from "@/public/materials/bread2.png";
import sweet2 from "@/public/materials/sweet4.png";
import AnimatedSection from "@/components/AnimatedSection";
export default function Contact() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    email: "",
    question: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Функція для екранування всіх зарезервованих символів у MarkdownV2
  const escapeMarkdown = (text: string) => {
    return text.replace(/[_\*\[\]\(\)\~`>#\+-=|\{\}\.!]/g, "\\$&");
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.question) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Форматуємо повідомлення для Telegram у MarkdownV2
    const telegramMessage = `
📩 *Нове повідомлення з форми контактів*

👤 *Ім'я*: ${escapeMarkdown(formData.name)}
📲 *Telegram*: ${escapeMarkdown(formData.telegram)}
📧 *Email*: ${escapeMarkdown(formData.email)}
💬 *Питання*:
_${escapeMarkdown(formData.question)}_
    `.trim();

    try {
      // Відправка в Telegram
      const telegramResponse = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: telegramMessage }),
      });

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json();
        throw new Error(errorData.details || "Failed to send Telegram message");
      }

      // Відправка в Google Sheets
      const sheetsResponse = await fetch("/api/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          data: {
            name: formData.name,
            telegram: formData.telegram,
            email: formData.email,
            question: formData.question,
          },
        }),
      });

      if (!sheetsResponse.ok) {
        throw new Error("Failed to add data to Google Sheets");
      }

      setStatus("success");
      setFormData({ name: "", telegram: "", email: "", question: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <AnimatedSection className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)] overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <Image
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
          className="absolute -right-20 sm:-right-40 lg:-right-85 z-15 rotate-10 bottom-45 md:bottom-20 lg:bottom-0 drop-shadow-2xl w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        /> */}
        <h1 className="text-3xl sm:text-4xl font-bold  mb-8 text-center">
          {currentLocale === "pl" ? "Kontakt" : "Contact"}
        </h1>
        <div className="grid grid-cols-1 gap-8 mb-12 z-20">
          <div className=" bg-white/95 backdrop-blur-sm rounded-3xl p-6   z-20">
            <p className="">
              {currentLocale === "pl"
                ? "Z przyjemnością odpowiem na wszystkie Twoje pytania. Zostaw swoje dane poniżej, a skontaktuję się z Tobą jak najszybciej:"
                : "I’ll be happy to answer all your questions. Leave your details below, and I’ll get back to you as soon as possible:"}
            </p>
          </div>
          <div className=" bg-white/95 backdrop-blur-sm rounded-3xl p-6">
            <div id="contact-form" className="space-y-4">
              <div>
                <label className="block  font-medium mb-1">
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
                <label className="block  font-medium mb-1">
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
                <label className="block  font-medium mb-1">
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
                <label className="block  font-medium mb-1">
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
                  disabled={status === "loading"}
                  className={`px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105  hover:shadow-xl ${
                    status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {status === "loading"
                    ? currentLocale === "pl"
                      ? "Wysyłanie..."
                      : "Sending..."
                    : currentLocale === "pl"
                    ? "Wyślij"
                    : "Send"}
                </button>
              </div>
              {status === "success" && (
                <p className="text-green-600 text-center">
                  {currentLocale === "pl"
                    ? "Wiadomość wysłana pomyślnie!"
                    : "Message sent successfully!"}
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-center">
                  {currentLocale === "pl"
                    ? "Błąd podczas wysyłania wiadomości. Spróbuj ponownie."
                    : "Error sending message. Please try again."}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className=" mb-4">
            {currentLocale === "pl"
              ? "Śledź mnie, aby być na bieżąco z warsztatami i nowościami ze świata piekarnictwa:"
              : "Follow me to stay updated on workshops and baking news:"}
          </p>
          <div className="flex justify-center items-center flex-col md:flex-row gap-4">
            <Link
              href="https://instagram.com/slaviksemkiv"
              target="_blank"
              className="flex items-center gap-2  hover:text-[var(--accent-color)] transition-colors"
            >
              <Instagram className="w-6 h-6" />
              slaviksemkiv
            </Link>
            <Link
              href="https://t.me/slaviksemkiv"
              target="_blank"
              className="flex items-center gap-2  hover:text-[var(--accent-color)] transition-colors"
            >
              <Send className="w-6 h-6" />
              Telegram
            </Link>
            <Link
              href="https://wa.me/1234567890"
              target="_blank"
              className="flex items-center gap-2  hover:text-[var(--accent-color)] transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
