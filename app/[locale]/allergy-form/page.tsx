"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

export default function AllergyForm() {
  const currentLocale = useCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--main-color)] pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentLocale === 'pl' ? 'Formularz zgłoszenia alergii' : 'Allergy Report Form'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {currentLocale === 'pl' ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">FORMULARZ ZGŁOSZENIA ALERGII</h2>
              </div>

              <div className="space-y-6">
                <section className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Dane uczestnika:</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 mb-1">Imię i nazwisko:</label>
                      <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Data szkolenia:</label>
                      <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Telefon / e-mail:</label>
                      <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    </div>
                  </div>
                </section>

                <section className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Zgłaszane alergie / nietolerancje pokarmowe:</h3>
                  <div className="space-y-2">
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Oświadczam, że wszystkie podane powyżej informacje są zgodne z prawdą.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Przyjmuję do wiadomości, że organizator szkolenia nie gwarantuje wyeliminowania ryzyka kontaktu z alergenami.
                  </p>
                </section>

                <section className="border-t pt-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Data i podpis uczestnika:</label>
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                  </div>
                </section>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Formularz można wydrukować, wypełnić i przesłać na adres: slaviksemkiv12@gmail.com
                  <br />
                  lub dostarczyć w dniu szkolenia.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">ALLERGY REPORT FORM</h2>
              </div>

              <div className="space-y-6">
                <section className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Participant Information:</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name:</label>
                      <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Training Date:</label>
                      <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Phone / Email:</label>
                      <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    </div>
                  </div>
                </section>

                <section className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Reported Allergies / Food Intolerances:</h3>
                  <div className="space-y-2">
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    I declare that all information provided above is true.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    I acknowledge that the training organizer does not guarantee the elimination of the risk of contact with allergens.
                  </p>
                </section>

                <section className="border-t pt-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Date and Participant Signature:</label>
                    <div className="border-b-2 border-dotted border-gray-400 min-h-[2rem]"></div>
                  </div>
                </section>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  The form can be printed, filled out and sent to: slaviksemkiv12@gmail.com
                  <br />
                  or delivered on the day of training.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

