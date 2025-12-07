"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

export default function ImageConsentForm() {
  const currentLocale = useCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--main-color)] pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentLocale === 'pl' ? 'Oświadczenie o zgodzie na wizerunek' : 'Image Consent Statement'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {currentLocale === 'pl' ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">OŚWIADCZENIE O WYRAŻENIU ZGODY NA WIZERUNEK</h2>
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
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Wyrażam dobrowolną zgodę na utrwalanie i wykorzystanie mojego wizerunku podczas
                    szkolenia prowadzonego przez Yaroslav Semkiv &quot;Nieznany Piekarz&quot;.
                  </p>
                </section>

                <section className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">Zgoda obejmuje publikację zdjęć i nagrań:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>na stronie internetowej,</li>
                    <li>w mediach społecznościowych,</li>
                    <li>w materiałach promocyjnych marki.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Zgoda jest dobrowolna, nieodpłatna i bezterminowa. Mogę ją wycofać w przyszłości,
                    jednak nie wpływa to na publikacje wykonane przed jej cofnięciem.
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
                <h2 className="text-2xl font-semibold mb-2">IMAGE CONSENT STATEMENT</h2>
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
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    I voluntarily consent to the recording and use of my image during
                    training conducted by Yaroslav Semkiv &quot;Unknown Baker&quot;.
                  </p>
                </section>

                <section className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">Consent includes publication of photos and recordings:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>on the website,</li>
                    <li>on social media,</li>
                    <li>in brand promotional materials.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Consent is voluntary, free of charge and unlimited in time. I can withdraw it in the future,
                    however, this does not affect publications made before its withdrawal.
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

