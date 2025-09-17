"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

export default function PrivacyPolicy() {
  const currentLocale = useCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--main-color)] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentLocale === 'pl' ? 'Polityka prywatności' : 'Privacy Policy'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {currentLocale === 'pl' ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Informacje ogólne</h2>
                <p className="text-gray-700 leading-relaxed">
                  Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych 
                  użytkowników strony internetowej prowadzonej przez Yaroslav Semkiv, z siedzibą w Warszawie, 
                  ul. Franciszka Adolfa Achera 9/U1, 02-495, NIP: 5272748962, REGON: 5286780087.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Administrator danych</h2>
                <p className="text-gray-700 leading-relaxed">
                  Administratorem danych osobowych jest Yaroslav Semkiv, kontakt: slaviksemkiv12@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Rodzaje przetwarzanych danych</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Przetwarzamy następujące kategorie danych osobowych:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Dane identyfikacyjne (imię, nazwisko)</li>
                  <li>Dane kontaktowe (adres e-mail, numer telefonu)</li>
                  <li>Dane techniczne (adres IP, informacje o przeglądarce)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Cele przetwarzania danych</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Dane osobowe przetwarzane są w następujących celach:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Realizacja umów sprzedaży szkoleń i produktów</li>
                  <li>Kontakt z klientami</li>
                  <li>Marketing bezpośredni</li>
                  <li>Wypełnienie obowiązków prawnych</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Podstawa prawna</h2>
                <p className="text-gray-700 leading-relaxed">
                  Przetwarzanie danych osobowych odbywa się na podstawie art. 6 ust. 1 RODO, 
                  w szczególności: wykonanie umowy, prawnie uzasadniony interes administratora, 
                  zgoda osoby, której dane dotyczą.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Okres przechowywania danych</h2>
                <p className="text-gray-700 leading-relaxed">
                  Dane osobowe przechowywane są przez okres niezbędny do realizacji celów, 
                  dla których zostały zebrane, nie dłużej jednak niż przez okres wymagany przepisami prawa.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Prawa osoby, której dane dotyczą</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Przysługuje Państwu prawo do:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Dostępu do danych osobowych</li>
                  <li>Sprostowania danych osobowych</li>
                  <li>Usunięcia danych osobowych</li>
                  <li>Ograniczenia przetwarzania danych osobowych</li>
                  <li>Przenoszenia danych osobowych</li>
                  <li>Wniesienia sprzeciwu wobec przetwarzania danych osobowych</li>
                  <li>Cofnięcia zgody w dowolnym momencie</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Pliki cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  Strona internetowa używa plików cookies w celu zapewnienia prawidłowego funkcjonowania 
                  oraz analizy ruchu na stronie. Użytkownik może w każdej chwili zmienić ustawienia 
                  dotyczące plików cookies w swojej przeglądarce.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Udostępnianie danych osobowych</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Dane osobowe mogą być udostępniane:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Dostawcom usług technicznych (hosting, obsługa płatności)</li>
                  <li>Organom publicznym na podstawie obowiązujących przepisów prawa</li>
                  <li>Partnerom biznesowym wyłącznie w celu realizacji umów</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Bezpieczeństwo danych</h2>
                <p className="text-gray-700 leading-relaxed">
                  Administrator stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony 
                  danych osobowych przed nieuprawnionym dostępem, utratą, zniszczeniem lub modyfikacją. 
                  Dane są przechowywane na bezpiecznych serwerach z szyfrowaniem SSL.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Przekazywanie danych do państw trzecich</h2>
                <p className="text-gray-700 leading-relaxed">
                  Dane osobowe mogą być przekazywane do państw trzecich wyłącznie w przypadku, gdy 
                  Komisja Europejska uznała dany kraj za zapewniający odpowiedni poziom ochrony danych 
                  lub gdy zastosowano odpowiednie zabezpieczenia prawne.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Zmiany w Polityce Prywatności</h2>
                <p className="text-gray-700 leading-relaxed">
                  Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności. 
                  O wszelkich zmianach użytkownicy będą informowani poprzez publikację na stronie 
                  internetowej. Zmiany wchodzą w życie po ich opublikowaniu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Prawo do skargi</h2>
                <p className="text-gray-700 leading-relaxed">
                  Osoba, której dane dotyczą, ma prawo wniesienia skargi do organu nadzorczego 
                  (Prezes Urzędu Ochrony Danych Osobowych) w przypadku naruszenia przepisów o ochronie 
                  danych osobowych.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">14. Kontakt</h2>
                <p className="text-gray-700 leading-relaxed">
                  W sprawach dotyczących przetwarzania danych osobowych prosimy o kontakt: 
                  slaviksemkiv12@gmail.com
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. General Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy defines the rules for processing and protecting personal data 
                  of users of the website operated by Yaroslav Semkiv, based in Warsaw, 
                  ul. Franciszka Adolfa Achera 9/U1, 02-495, NIP: 5272748962, REGON: 5286780087.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Data Controller</h2>
                <p className="text-gray-700 leading-relaxed">
                  The data controller is Yaroslav Semkiv, contact: slaviksemkiv12@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Types of Processed Data</h2>
                <p className="text-gray-700 leading-relaxed mb-2">We process the following categories of personal data:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Identification data (name, surname)</li>
                  <li>Contact data (email address, phone number)</li>
                  <li>Technical data (IP address, browser information)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Purposes of Data Processing</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Personal data is processed for the following purposes:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Performance of training and product sales contracts</li>
                  <li>Customer contact</li>
                  <li>Direct marketing</li>
                  <li>Fulfillment of legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Legal Basis</h2>
                <p className="text-gray-700 leading-relaxed">
                  Processing of personal data is based on Article 6(1) of GDPR, 
                  in particular: contract performance, legitimate interest of the controller, 
                  consent of the data subject.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Data Retention Period</h2>
                <p className="text-gray-700 leading-relaxed">
                  Personal data is stored for the period necessary to achieve the purposes 
                  for which it was collected, but no longer than required by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Rights of the Data Subject</h2>
                <p className="text-gray-700 leading-relaxed mb-2">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Access personal data</li>
                  <li>Rectify personal data</li>
                  <li>Erase personal data</li>
                  <li>Restrict processing of personal data</li>
                  <li>Data portability</li>
                  <li>Object to processing of personal data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  The website uses cookies to ensure proper functioning and analyze website traffic. 
                  Users can change cookie settings in their browser at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Sharing Personal Data</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Personal data may be shared with:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Technical service providers (hosting, payment processing)</li>
                  <li>Public authorities based on applicable legal provisions</li>
                  <li>Business partners solely for contract performance purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  The controller applies appropriate technical and organizational measures to protect 
                  personal data against unauthorized access, loss, destruction, or modification. 
                  Data is stored on secure servers with SSL encryption.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Transfer of Data to Third Countries</h2>
                <p className="text-gray-700 leading-relaxed">
                  Personal data may be transferred to third countries only when the European Commission 
                  has recognized a given country as ensuring an adequate level of data protection or 
                  when appropriate legal safeguards are applied.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Changes to Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  The controller reserves the right to make changes to the Privacy Policy. 
                  Users will be informed of any changes by publishing them on the website. 
                  Changes take effect after publication.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Right to Complain</h2>
                <p className="text-gray-700 leading-relaxed">
                  The data subject has the right to lodge a complaint with the supervisory authority 
                  (President of the Personal Data Protection Office) in case of violation of personal 
                  data protection regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">14. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  For matters related to personal data processing, please contact: 
                  slaviksemkiv12@gmail.com
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}