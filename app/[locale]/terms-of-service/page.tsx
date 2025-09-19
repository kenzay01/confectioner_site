
"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

export default function TermsOfService() {
  const currentLocale = useCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--main-color)] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentLocale === 'pl' ? 'Regulamin' : 'Terms of Service'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {currentLocale === 'pl' ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Postanowienia ogólne</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Niniejszy regulamin określa zasady korzystania ze strony internetowej prowadzonej przez Yaroslav Semkiv (&quot;Nieznany piekarz&quot;), w tym zasady zakupu szkoleń oferowanych przez Administratora.</li>
                  <li>Właścicielem Strony jest Yaroslav Semkiv Nieznany piekarz, z siedzibą w Warszawie, ul. Franciszka Adolfa Achera 9/U1, 02-495, wpisanym do CEIDG/KRS, NIP: 5272748962, REGON: 528678087, kontakt: slaviksemkiv12@gmail.com</li>
                  <li>Kontakt z Administratorem możliwy jest drogą elektroniczną pod adresem e-mail: slaviksemkiv12@gmail.com.</li>
                  <li>Regulamin jest udostępniany nieodpłatnie na Stronie w formie umożliwiającej jego pobranie, utrwalenie i wydrukowanie.</li>
                  <li>Zakup szkolenia oznacza akceptację niniejszego Regulaminu.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Definicje</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Użytkownik/Klient</strong> – osoba korzystająca ze Strony i dokonująca zakupu szkolenia.</li>
                  <li><strong>Administrator/Sprzedawca</strong> – właściciel Strony, organizator szkoleń.</li>
                  <li><strong>Szkolenie</strong> – usługa edukacyjna (stacjonarna lub online) dostępna w ofercie Strony.</li>
                  <li><strong>Umowa</strong> – umowa sprzedaży/usługi zawierana między Klientem a Sprzedawcą.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Zakres usług</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator prowadzi sprzedaż szkoleń stacjonarnych i/lub online poprzez Stronę.</li>
                  <li>Opisy szkoleń, terminy, program oraz ceny podane są na Stronie.</li>
                  <li>Ceny podane na Stronie są cenami brutto (zawierają wszystkie podatki).</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Zasady składania zamówień</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Klient składa zamówienie poprzez formularz rejestracyjny dostępny na Stronie.</li>
                  <li>Warunkiem złożenia zamówienia jest podanie danych niezbędnych do realizacji umowy.</li>
                  <li>Po złożeniu zamówienia Klient otrzymuje potwierdzenie na wskazany adres e-mail.</li>
                  <li>Umowa sprzedaży zostaje zawarta z chwilą otrzymania potwierdzenia przez Klienta.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Płatności</h2>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Płatności dokonywane są za pośrednictwem systemów płatności elektronicznych (Przelewy24) lub przelewem tradycyjnym.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Realizacja usług i dostawa</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>W przypadku szkoleń stacjonarnych – udział w szkoleniu jest możliwy po dokonaniu pełnej płatności.</li>
                  <li>W przypadku kursów online – dostęp do materiałów szkoleniowych przekazywany jest drogą elektroniczną na adres e-mail podany przez Klienta w ciągu 24 godzin roboczych od zaksięgowania wpłaty na koncie Administratora.</li>
                  <li>Materiały szkoleniowe dostarczane są w formie cyfrowej (linki do platformy e-learningowej, pliki PDF, wideo) na wskazany przez Klienta adres e-mail.</li>
                  <li>Klient otrzymuje potwierdzenie dostarczenia materiałów na adres e-mail podany w zamówieniu.</li>
                  <li>Administrator zastrzega sobie prawo do zmiany terminu szkolenia w przypadku wystąpienia przyczyn od niego niezależnych (np. choroba prowadzącego). W takiej sytuacji Klient ma prawo:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>zaakceptować nowy termin,</li>
                      <li>lub odstąpić od umowy i uzyskać pełny zwrot wpłaty.</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Odstąpienie od umowy</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Klient będący konsumentem ma prawo odstąpić od umowy w terminie 14 dni od dnia jej zawarcia, bez podawania przyczyny.</li>
                  <li>Prawo odstąpienia nie przysługuje, jeśli:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>szkolenie zostało w pełni zrealizowane przed upływem 14 dni (za zgodą Klienta),</li>
                      <li>Klient uzyskał dostęp do materiałów online w wersji cyfrowej, które nie podlegają zwrotowi po rozpoczęciu korzystania.</li>
                    </ul>
                  </li>
                  <li>W celu odstąpienia od umowy Klient powinien przesłać stosowne oświadczenie na adres e-mail Administratora.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Reklamacje i rozstrzyganie sporów</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Klient ma prawo złożyć reklamację w przypadku niezgodności usługi z umową.</li>
                  <li>Reklamacje należy kierować na adres e-mail: slaviksemkiv12@gmail.com.</li>
                  <li>Administrator rozpatrzy reklamację w terminie 14 dni od jej otrzymania, zgodnie z art. 561-563 Kodeksu cywilnego.</li>
                  <li>W przypadku niezadowalającej odpowiedzi na reklamację, Klient może skorzystać z pozasądowych sposobów rozstrzygania sporów, w tym:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Stałego Polubownego Sądu Konsumenckiego przy Wojewódzkim Inspektoracie Inspekcji Handlowej</li>
                      <li>Europejskiej Platformy Rozstrzygania Sporów Online (ODR) dostępnej pod adresem: https://ec.europa.eu/consumers/odr/</li>
                      <li>Pomocy Rzecznika Finansowego (w sprawach dotyczących płatności)</li>
                    </ul>
                  </li>
                  <li>Klient może również skorzystać z pomocy miejskich lub powiatowych rzeczników konsumentów.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Odpowiedzialność</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator nie ponosi odpowiedzialności za przerwy w funkcjonowaniu Strony spowodowane awariami niezależnymi od niego.</li>
                  <li>Administrator nie odpowiada za brak możliwości uczestnictwa w szkoleniu z przyczyn leżących po stronie Klienta (np. brak dostępu do Internetu, błędne dane w zamówieniu).</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Prawa autorskie</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Materiały szkoleniowe podlegają ochronie prawnej i mogą być wykorzystywane wyłącznie przez Klienta na własne potrzeby.</li>
                  <li>Zabronione jest ich kopiowanie, rozpowszechnianie, udostępnianie osobom trzecim bez zgody Administratora.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Prawa konsumenta</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Klient będący konsumentem ma prawo do:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Otrzymania pełnych informacji o usłudze przed zawarciem umowy</li>
                      <li>Odstąpienia od umowy w terminie 14 dni (zgodnie z art. 27 ustawy o prawach konsumenta)</li>
                      <li>Gwarancji jakości usługi zgodnej z umową</li>
                      <li>Dostępu do pozasądowych sposobów rozstrzygania sporów</li>
                      <li>Ochrony danych osobowych zgodnie z RODO</li>
                    </ul>
                  </li>
                  <li>Administrator informuje, że umowa może być zawarta w języku polskim.</li>
                  <li>Klient może skorzystać z wzoru oświadczenia o odstąpieniu od umowy dostępnego na stronie internetowej.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Dane osobowe i cookies</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator przetwarza dane osobowe Klientów zgodnie z obowiązującymi przepisami prawa, w tym RODO.</li>
                  <li>Szczegółowe informacje dotyczące przetwarzania danych osobowych oraz plików cookies zawiera Polityka Prywatności dostępna na Stronie.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Postanowienia końcowe</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator zastrzega sobie prawo do zmiany Regulaminu.</li>
                  <li>Do umów zawieranych między Klientem a Administratorem stosuje się prawo polskie.</li>
                  <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy Kodeksu cywilnego oraz ustawy o prawach konsumenta.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">14. Dodatkowe informacje</h2>
                <div className="text-gray-700 leading-relaxed ml-4">
                  <p>Imię: Yaroslav</p>
                  <p>Nazwisko: Semkiv</p>
                  <p>Firma prowadzącego: Yaroslav Semkiv NIEZNANY PIEKARZ</p>
                  <p>NIP: 5272748962</p>
                  <p>REGON: 528678087</p>
                  <p>Forma prawna: CEIDG - Osoba fizyczna prowadząca działalność gospodarczą</p>
                  <p>Rekwizyty: 08 1160 2202 0000 0006 2929 4950</p>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. General Provisions</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>These Terms of Service define the rules for using the website operated by Yaroslav Semkiv (&quot;Unknown Baker&quot;), including the rules for purchasing training offered by the Administrator.</li>
                  <li>The website owner is Yaroslav Semkiv Unknown Baker, based in Warsaw, ul. Franciszka Adolfa Achera 9/U1, 02-495, registered in CEIDG/KRS, NIP: 5272748962, REGON: 528678087, contact: slaviksemkiv12@gmail.com</li>
                  <li>Contact with the Administrator is possible electronically at: slaviksemkiv12@gmail.com.</li>
                  <li>The Terms of Service are made available free of charge on the Website in a form that allows downloading, recording and printing.</li>
                  <li>Purchasing training means accepting these Terms of Service.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>User/Client</strong> – a person using the Website and making a training purchase.</li>
                  <li><strong>Administrator/Seller</strong> – website owner, training organizer.</li>
                  <li><strong>Training</strong> – educational service (stationary or online) available in the Website&apos;s offer.</li>
                  <li><strong>Contract</strong> – sales/service contract concluded between the Client and the Seller.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Scope of Services</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Administrator sells stationary and/or online training through the Website.</li>
                  <li>Training descriptions, dates, program and prices are provided on the Website.</li>
                  <li>Prices listed on the Website are gross prices (include all taxes).</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Order Placement Rules</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Client places an order through the registration form available on the Website.</li>
                  <li>A condition for placing an order is providing data necessary for contract performance.</li>
                  <li>After placing an order, the Client receives confirmation at the specified email address.</li>
                  <li>The sales contract is concluded when the Client receives confirmation.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Payments</h2>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Payments are made through electronic payment systems (Przelewy24) or traditional bank transfer.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Service Performance and Delivery</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>For stationary training – participation in training is possible after full payment.</li>
                  <li>For online courses – access to training materials is provided electronically to the Client&apos;s e-mail address within 24 business hours after payment is recorded in the Administrator&apos;s account.</li>
                  <li>Training materials are delivered in digital form (links to e-learning platform, PDF files, videos) to the e-mail address indicated by the Client.</li>
                  <li>The Client receives confirmation of material delivery to the e-mail address provided in the order.</li>
                  <li>The Administrator reserves the right to change the training date in case of reasons beyond their control (e.g., instructor illness). In such a situation, the Client has the right to:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>accept the new date,</li>
                      <li>or withdraw from the contract and receive a full refund.</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Withdrawal from Contract</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>A Client who is a consumer has the right to withdraw from the contract within 14 days from its conclusion, without giving a reason.</li>
                  <li>The right of withdrawal does not apply if:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>training was fully completed before the 14-day period (with Client&apos;s consent),</li>
                      <li>the Client gained access to online materials in digital version, which are non-returnable after use begins.</li>
                    </ul>
                  </li>
                  <li>To withdraw from the contract, the Client should send an appropriate statement to the Administrator&apos;s email address.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Complaints and Dispute Resolution</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Client has the right to file a complaint in case of service non-compliance with the contract.</li>
                  <li>Complaints should be directed to email address: slaviksemkiv12@gmail.com.</li>
                  <li>The Administrator will consider the complaint within 14 days of receiving it, in accordance with Articles 561-563 of the Civil Code.</li>
                  <li>In case of unsatisfactory response to the complaint, the Client may use out-of-court dispute resolution methods, including:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Permanent Consumer Arbitration Court at the Regional Inspectorate of Trade Inspection</li>
                      <li>European Online Dispute Resolution Platform (ODR) available at: https://ec.europa.eu/consumers/odr/</li>
                      <li>Financial Ombudsman assistance (in payment-related matters)</li>
                    </ul>
                  </li>
                  <li>The Client may also seek assistance from municipal or district consumer advocates.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Liability</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Administrator is not liable for interruptions in Website functioning caused by failures beyond their control.</li>
                  <li>The Administrator is not responsible for inability to participate in training due to reasons on the Client&apos;s side (e.g., lack of Internet access, incorrect order data).</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Copyright</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Training materials are legally protected and may only be used by the Client for their own needs.</li>
                  <li>Copying, distributing, or sharing them with third parties without Administrator&apos;s consent is prohibited.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Consumer Rights</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>A Client who is a consumer has the right to:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Receive full information about the service before concluding a contract</li>
                      <li>Withdraw from the contract within 14 days (in accordance with Article 27 of the Consumer Rights Act)</li>
                      <li>Quality guarantee of the service in accordance with the contract</li>
                      <li>Access to out-of-court dispute resolution methods</li>
                      <li>Personal data protection in accordance with GDPR</li>
                    </ul>
                  </li>
                  <li>The Administrator informs that the contract may be concluded in Polish.</li>
                  <li>The Client may use the withdrawal form template available on the website.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Personal Data and Cookies</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Administrator processes Clients&apos; personal data in accordance with applicable law, including GDPR.</li>
                  <li>Detailed information regarding personal data processing and cookies is contained in the Privacy Policy available on the Website.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Final Provisions</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Administrator reserves the right to change the Terms of Service.</li>
                  <li>Polish law applies to contracts concluded between the Client and Administrator.</li>
                  <li>In matters not regulated by these Terms of Service, the provisions of the Civil Code and the Consumer Rights Act apply.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">14. Additional Information</h2>
                <div className="text-gray-700 leading-relaxed ml-4">
                  <p>First Name: Yaroslav</p>
                  <p>Last Name: Semkiv</p>
                  <p>Company: Yaroslav Semkiv NIEZNANY PIEKARZ</p>
                  <p>NIP: 5272748962</p>
                  <p>REGON: 528678087</p>
                  <p>Legal Form: CEIDG - Individual Entrepreneur</p>
                  <p>Account Details: 08 1160 2202 0000 0006 2929 4950</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
