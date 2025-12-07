"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

export default function TermsOfService() {
  const currentLocale = useCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--main-color)] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentLocale === 'pl' ? 'Regulamin świadczenia usług szkoleniowych' : 'Terms of Service'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {currentLocale === 'pl' ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">REGULAMIN ŚWIADCZENIA USŁUG SZKOLENIOWYCH</h2>
                <p className="text-gray-700 mb-4 font-semibold">Yaroslav Semkiv &quot;Nieznany Piekarz&quot;</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Postanowienia ogólne</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Niniejszy Regulamin określa zasady korzystania ze Strony internetowej oraz zasady zakupu i realizacji usług szkoleniowych oferowanych przez Administratora.</li>
                  <li>Administratorem i sprzedawcą usług szkoleniowych jest:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Yaroslav Semkiv &quot;Nieznany Piekarz&quot;</li>
                      <li>Forma prawna: przedsiębiorca wpisany do CEIDG</li>
                      <li>NIP: 5272748962</li>
                      <li>REGON: 528678087</li>
                      <li>Adres: ul. Franciszka Adolfa Achera 9/U1, 02-495 Warszawa</li>
                      <li>E-mail: slaviksemkiv12@gmail.com</li>
                      <li>Rachunek bankowy: 08 1160 2202 0000 0006 2929 4950</li>
                    </ul>
                  </li>
                  <li>Regulamin udostępniany jest nieodpłatnie w sposób umożliwiający jego pobranie, zapisanie i wydrukowanie.</li>
                  <li>Zakup szkolenia oznacza akceptację Regulaminu.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Definicje</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Użytkownik/Klient</strong> – osoba korzystająca ze Strony i kupująca szkolenie.</li>
                  <li><strong>Administrator/Sprzedawca</strong> – właściciel marki &quot;Nieznany Piekarz&quot;.</li>
                  <li><strong>Szkolenie</strong> – usługa edukacyjna stacjonarna lub online.</li>
                  <li><strong>Umowa</strong> – umowa sprzedaży lub świadczenia usług zawarta pomiędzy Klientem a Administratorem.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Zakres usług</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator prowadzi sprzedaż szkoleń stacjonarnych i online.</li>
                  <li>Opisy szkoleń, program oraz ceny znajdują się na Stronie.</li>
                  <li>Ceny podane na Stronie są cenami brutto.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Wymagania techniczne</h2>
                <p className="text-gray-700 mb-2 ml-4">Do korzystania ze szkoleń online wymagane jest:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8">
                  <li>urządzenie z dostępem do Internetu,</li>
                  <li>aktualna przeglądarka internetowa,</li>
                  <li>aktywny adres e-mail,</li>
                  <li>łącze internetowe min. 5 Mb/s.</li>
                </ul>
                <p className="text-gray-700 mt-2 ml-4">Administrator nie odpowiada za problemy techniczne po stronie Klienta.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Zasady składania zamówień</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Zamówienia składa się poprzez formularz na stronie internetowej.</li>
                  <li>Klient zobowiązany jest podać prawdziwe dane.</li>
                  <li>Po złożeniu zamówienia Klient otrzymuje potwierdzenie e-mail.</li>
                  <li>Umowa zostaje zawarta z chwilą otrzymania potwierdzenia zamówienia.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Płatności</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Płatności dokonywane są poprzez system płatności elektronicznych lub tradycyjny przelew.</li>
                  <li>Brak płatności może skutkować anulowaniem zamówienia.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Realizacja usług</h2>
                
                <h3 className="text-lg font-semibold mb-2 mt-4">Szkolenia stacjonarne:</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Udział w szkoleniu jest możliwy wyłącznie po opłaceniu go przez Klienta.</li>
                  <li>Uczestnik zobowiązuje się do przestrzegania zasad BHP i zaleceń prowadzącego.</li>
                  <li>Administrator nie ponosi odpowiedzialności za szkody wyrządzone przez Uczestnika.</li>
                </ol>

                <h3 className="text-lg font-semibold mb-2 mt-4">Zasady BHP:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Uczestnik musi stosować odzież ochronną: fartuch, obuwie robocze, włosy spięte lub zakryte.</li>
                  <li>Zabronione jest noszenie biżuterii stanowiącej zagrożenie (pierścionki, bransoletki itp.).</li>
                  <li>Zabrania się obsługiwania urządzeń bez instruktażu.</li>
                  <li>Uczestnik zobowiązany jest do ostrożności przy pracy z gorącymi elementami, nożami, ciężkimi blachami i sprzętem.</li>
                  <li>Uczestnik musi zgłosić wszelkie niebezpieczne sytuacje prowadzącemu.</li>
                  <li>Zabrania się udziału w szkoleniu pod wpływem alkoholu lub środków odurzających.</li>
                  <li>Naruszenie zasad BHP może skutkować usunięciem ze szkolenia bez zwrotu opłaty.</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 mt-4">Informacja o alergenach:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Podczas szkoleń używane są produkty mogące zawierać alergeny: gluten, jaja, mleko, orzechy, sezam, soja, kakao, miód i inne.</li>
                  <li>Nie ma możliwości całkowitego wyeliminowania ryzyka zanieczyszczenia krzyżowego.</li>
                  <li>Uczestnik zobowiązany jest zgłosić alergie min. 48 godzin przed szkoleniem.</li>
                  <li>Administrator nie odpowiada za reakcje alergiczne wynikające z braku zgłoszenia lub zatajenia alergii.</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 mt-4">Szkolenia online:</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Dostęp do materiałów udzielany jest po zaksięgowaniu wpłaty.</li>
                  <li>Materiały cyfrowe nie podlegają zwrotowi.</li>
                </ol>

                <h3 className="text-lg font-semibold mb-2 mt-4">Zmiana terminu szkolenia:</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator może zmienić termin w sytuacjach niezależnych od niego.</li>
                  <li>Klient może zaakceptować nowy termin lub otrzymać pełny zwrot wpłaty.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Odstąpienie od umowy i rezygnacja</h2>
                
                <h3 className="text-lg font-semibold mb-2 mt-4">Odstąpienie w ciągu 14 dni:</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Konsument może odstąpić od umowy w ciągu 14 dni.</li>
                  <li>Prawo to nie obowiązuje, jeżeli szkolenie zostało wykonane lub Klient uzyskał dostęp do treści cyfrowych.</li>
                </ol>

                <h3 className="text-lg font-semibold mb-2 mt-4">Rezygnacja po 14 dniach:</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Po 14 dniach od zakupu zwrot środków nie przysługuje.</li>
                  <li>Nieobecność na szkoleniu oznacza rezygnację bez zwrotu.</li>
                  <li>Klient może przepisać miejsce innej osobie min. 48 h przed szkoleniem.</li>
                  <li>Administrator może, ale nie musi, umożliwić zmianę terminu.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Reklamacje</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Reklamacje można zgłaszać maksymalnie 7 dni po szkoleniu.</li>
                  <li>Reklamacja musi zawierać dane, opis zastrzeżeń i żądanie.</li>
                  <li>Administrator rozpatruje reklamację w ciągu 14 dni.</li>
                  <li>Reklamacji nie podlegają: subiektywne oceny, brak efektów, problemy techniczne Klienta.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Prawa autorskie</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Materiały szkoleniowe są chronione prawem autorskim.</li>
                  <li>Zabronione jest kopiowanie, udostępnianie, wykorzystywanie komercyjne.</li>
                  <li>Klient otrzymuje licencję wyłącznie na własny użytek.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Wizerunek uczestników</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Uczestnik może wyrazić zgodę na wykorzystanie wizerunku.</li>
                  <li>Zgoda obejmuje publikację w materiałach promocyjnych, social media i stronie.</li>
                  <li>Zgoda jest dobrowolna, nieodpłatna i bezterminowa.</li>
                  <li>Wycofanie zgody nie działa wstecz.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Dane osobowe</h2>
                <p className="text-gray-700 ml-4">
                  Przetwarzanie danych regulowane jest Polityką Prywatności zgodną z RODO.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Postanowienia końcowe</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator może zmienić Regulamin.</li>
                  <li>W sprawach nieuregulowanych obowiązuje prawo polskie.</li>
                  <li>Regulamin obowiązuje od dnia publikacji.</li>
                </ol>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
