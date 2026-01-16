"use client";
import { useState } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import AnimatedSection from "@/components/AnimatedSection";

export default function Contact() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Функція для екранування всіх зарезервованих символів у MarkdownV2
    const handleSubmit = async () => {
    if (!formData.name || !formData.question) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Форматуємо email повідомлення
    const emailSubject = "📩 Nowa wiadomość z formularza kontaktowego";
    
    const emailHtml = `
      <h2>📩 Nowa wiadomość z formularza kontaktowego</h2>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p><strong>👤 Imię i nazwisko:</strong> ${formData.name}</p>
      <p><strong>📧 Email:</strong> ${formData.email || 'Nie podano'}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p><strong>💬 Pytanie:</strong></p>
      <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${formData.question}</p>
    `;

    const emailText = `
Nowa wiadomość z formularza kontaktowego

Imię i nazwisko: ${formData.name}
Email: ${formData.email || 'Nie podano'}

Pytanie:
${formData.question}
    `.trim();

    try {
      // Відправка email
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: emailSubject,
          html: emailHtml,
          text: emailText
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.details || "Failed to send email");
      }

      // Відправка в Google Sheets - вимкнено
      // const sheetsResponse = await fetch("/api/google-sheets", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     type: "contact",
      //     data: {
      //       name: formData.name,
      //       email: formData.email,
      //       question: formData.question,
      //     },
      //   }),
      // });

      // if (!sheetsResponse.ok) {
      //   throw new Error("Failed to add data to Google Sheets");
      // }

      setStatus("success");
      setFormData({ name: "", email: "", question: "" });
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          {currentLocale === "pl" ? "Kontakt" : "Contact"}
        </h1>
        <div className="grid grid-cols-1 gap-8 mb-12 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 z-20">
            <p className="">
              {currentLocale === "pl"
                ? "Z przyjemnością odpowiem na wszystkie Twoje pytania. Zostaw swoje dane poniżej, a skontaktuję się z Tobą jak najszybciej:"
                : "I’ll be happy to answer all your questions. Leave your details below, and I’ll get back to you as soon as possible:"}
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6">
            <div id="contact-form" className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  {currentLocale === "pl" ? "Imię i nazwisko" : "Name and surname"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  {currentLocale === "pl" ? "Adres e-mail" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  {currentLocale === "pl" ? "Pytanie" : "Question"}
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600"
                  rows={4}
                />
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className={`btn-unified px-6 py-3 ${
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
      </div>
    </AnimatedSection>
  );
}