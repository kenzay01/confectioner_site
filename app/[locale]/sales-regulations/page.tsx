"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

export default function SalesRegulations() {
  const currentLocale = useCurrentLanguage();

  return (
    <div className="min-h-screen bg-[var(--main-color)] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {currentLocale === 'pl' ? 'Regulamin sprzedaży' : 'Sales Regulations'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {currentLocale === 'pl' ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Postanowienia ogólne</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Niniejszy Regulamin sprzedaży określa warunki prowadzenia sprzedaży usług edukacyjnych (szkoleń) oraz produktów cyfrowych przez Yaroslav Semkiv &quot;Nieznany piekarz&quot;.</li>
                  <li>Sprzedawca: Yaroslav Semkiv, ul. Franciszka Adolfa Achera 9/U1, 02-495 Warszawa, NIP: 5272748962, REGON: 528678087, e-mail: slaviksemkiv12@gmail.com</li>
                  <li>Kupującym może być osoba fizyczna, prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej.</li>
                  <li>Zamówienie oznacza akceptację niniejszego regulaminu.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Przedmiot sprzedaży</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Sprzedawca prowadzi sprzedaż następujących usług i produktów:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Usługi edukacyjne (szkolenia stacjonarne i online) z zakresu piekarstwa i cukiernictwa</li>
                      <li>Produkty cyfrowe (kursy online, materiały szkoleniowe)</li>
                      <li>Konsultacje i doradztwo w zakresie piekarstwa</li>
                    </ul>
                  </li>
                  <li>Szczegółowe opisy usług i produktów znajdują się na stronie internetowej sprzedawcy.</li>
                  <li>Ceny podane na stronie są cenami brutto i zawierają podatek VAT.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Składanie zamówień</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Zamówienie może być złożone:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Poprzez formularz dostępny na stronie internetowej</li>
                      <li>Drogą elektroniczną na adres e-mail sprzedawcy</li>
                      <li>Telefonicznie pod numerem podanym na stronie</li>
                    </ul>
                  </li>
                  <li>Zamówienie powinno zawierać: rodzaj usługi/produktu, dane kontaktowe kupującego, preferowany termin (dla szkoleń stacjonarnych).</li>
                  <li>Sprzedawca potwierdza otrzymanie zamówienia w ciągu 24 godzin.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Płatności</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Formy płatności:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Przelew bankowy na konto: 08 1160 2202 0000 0006 2929 4950</li>
                      <li>Płatności elektroniczne (Przelewy24)</li>
                      <li>Płatność gotówką przy odbiorze (tylko szkolenia stacjonarne)</li>
                    </ul>
                  </li>
                  <li>Terminy płatności:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Szkolenia stacjonarne - płatność przed rozpoczęciem szkolenia</li>
                      <li>Kursy online - płatność przed otrzymaniem dostępu do materiałów</li>
                      <li>Konsultacje - płatność przed rozpoczęciem konsultacji</li>
                    </ul>
                  </li>
                  <li>W przypadku opóźnienia w płatności sprzedawca ma prawo wstrzymać realizację usługi.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Realizacja zamówień</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Szkolenia stacjonarne:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Realizowane w terminach podanych na stronie internetowej</li>
                      <li>Miejsce szkolenia podane w opisie konkretnego szkolenia</li>
                      <li>Wszystkie materiały szkoleniowe zapewnia sprzedawca</li>
                      <li>Liczba miejsc ograniczona - decyduje kolejność zgłoszeń</li>
                    </ul>
                  </li>
                  <li>Kursy online:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Dostęp do materiałów przekazywany w ciągu 48 godzin po zaksięgowaniu płatności</li>
                      <li>Dostęp do materiałów przez okres określony w opisie kursu</li>
                      <li>Materiały dostępne w formie cyfrowej na platformie wskazanej przez sprzedawcę</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Odstąpienie od umowy</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Konsument ma prawo odstąpić od umowy w terminie 14 dni od jej zawarcia bez podania przyczyny.</li>
                  <li>Prawo odstąpienia nie przysługuje w przypadku:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Usług w pełni wykonanych za zgodą konsumenta przed upływem terminu odstąpienia</li>
                      <li>Treści cyfrowych, które nie są dostarczane na nośniku materialnym, jeżeli wykonanie rozpoczęło się za zgodą konsumenta</li>
                      <li>Usług rozpoczętych przed upływem terminu odstąpienia za zgodą konsumenta</li>
                    </ul>
                  </li>
                  <li>W celu odstąpienia od umowy należy przesłać oświadczenie na adres e-mail sprzedawcy.</li>
                  <li>Zwrot płatności następuje w ciągu 14 dni od otrzymania oświadczenia o odstąpieniu.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Reklamacje</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Reklamacje można składać w przypadku niezgodności usługi z umową lub regulaminem.</li>
                  <li>Reklamacje należy kierować na adres e-mail: slaviksemkiv12@gmail.com</li>
                  <li>Reklamacja powinna zawierać: opis problemu, dane kontaktowe, numer zamówienia.</li>
                  <li>Sprzedawca rozpatruje reklamacje w terminie 14 dni roboczych.</li>
                  <li>Odpowiedź na reklamację wysyłana jest na adres e-mail wskazany w reklamacji.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Odpowiedzialność</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Sprzedawca ponosi odpowiedzialność za zgodność usługi z umową i regulaminem.</li>
                  <li>Sprzedawca nie ponosi odpowiedzialności za:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Przerwy w funkcjonowaniu strony internetowej spowodowane awariami niezależnymi</li>
                      <li>Brak możliwości uczestnictwa w szkoleniu z przyczyn leżących po stronie kupującego</li>
                      <li>Szkody wynikające z niewłaściwego korzystania z materiałów szkoleniowych</li>
                    </ul>
                  </li>
                  <li>Odpowiedzialność sprzedawcy jest ograniczona do wysokości zapłaconej ceny.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Prawa autorskie</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Wszystkie materiały szkoleniowe, przepisy i treści są chronione prawem autorskim.</li>
                  <li>Kupujący otrzymuje prawo do korzystania z materiałów wyłącznie na własne potrzeby.</li>
                  <li>Zabronione jest kopiowanie, rozpowszechnianie i udostępnianie materiałów osobom trzecim.</li>
                  <li>Naruszenie praw autorskich może skutkować roszczeniami odszkodowawczymi.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Ochrona danych osobowych</h2>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Sprzedawca przetwarza dane osobowe kupujących zgodnie z Polityką Prywatności dostępną na stronie internetowej, 
                  w oparciu o obowiązujące przepisy prawa, w tym RODO.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Postanowienia końcowe</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Sprzedawca zastrzega sobie prawo do zmiany regulaminu. Zmiany wchodzą w życie po opublikowaniu na stronie.</li>
                  <li>W sprawach nieuregulowanych regulaminem stosuje się przepisy Kodeksu cywilnego.</li>
                  <li>Do umów zawieranych z konsumentami stosuje się prawo polskie.</li>
                  <li>Regulamin wchodzi w życie z dniem 1 stycznia 2025 roku.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Dane kontaktowe sprzedawcy</h2>
                <div className="text-gray-700 leading-relaxed ml-4 bg-gray-50 p-4 rounded-lg">
                  <p><strong>Yaroslav Semkiv &quot;Nieznany piekarz&quot;</strong></p>
                  <p>ul. Franciszka Adolfa Achera 9/U1</p>
                  <p>02-495 Warszawa</p>
                  <p>NIP: 5272748962</p>
                  <p>REGON: 528678087</p>
                  <p>E-mail: slaviksemkiv12@gmail.com</p>
                  <p>Nr konta: 08 1160 2202 0000 0006 2929 4950</p>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. General Provisions</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>These Sales Regulations define the terms of sale of educational services (training) and digital products by Yaroslav Semkiv &quot;Unknown Baker&quot;.</li>
                  <li>Seller: Yaroslav Semkiv, ul. Franciszka Adolfa Achera 9/U1, 02-495 Warsaw, NIP: 5272748962, REGON: 528678087, e-mail: slaviksemkiv12@gmail.com</li>
                  <li>The buyer may be a natural person, legal entity, or organizational unit without legal personality.</li>
                  <li>Placing an order means acceptance of these regulations.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Subject of Sale</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The seller conducts sales of the following services and products:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Educational services (stationary and online training) in baking and confectionery</li>
                      <li>Digital products (online courses, training materials)</li>
                      <li>Consultations and advice in baking</li>
                    </ul>
                  </li>
                  <li>Detailed descriptions of services and products are available on the seller&apos;s website.</li>
                  <li>Prices listed on the website are gross prices and include VAT.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Order Placement</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Orders can be placed:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Through the form available on the website</li>
                      <li>Electronically to the seller&apos;s e-mail address</li>
                      <li>By phone to the number provided on the website</li>
                    </ul>
                  </li>
                  <li>The order should include: type of service/product, buyer&apos;s contact details, preferred date (for stationary training).</li>
                  <li>The seller confirms receipt of the order within 24 hours.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Payments</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Payment methods:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Bank transfer to account: 08 1160 2202 0000 0006 2929 4950</li>
                      <li>Electronic payments (Przelewy24)</li>
                      <li>Cash payment upon receipt (stationary training only)</li>
                    </ul>
                  </li>
                  <li>Payment terms:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Stationary training - payment before training starts</li>
                      <li>Online courses - payment before receiving access to materials</li>
                      <li>Consultations - payment before consultation starts</li>
                    </ul>
                  </li>
                  <li>In case of payment delay, the seller has the right to suspend service performance.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Order Fulfillment</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Stationary training:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Conducted on dates provided on the website</li>
                      <li>Training location specified in the description of the specific training</li>
                      <li>All training materials provided by the seller</li>
                      <li>Limited number of places - order of applications decides</li>
                    </ul>
                  </li>
                  <li>Online courses:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Access to materials provided within 48 hours after payment is recorded</li>
                      <li>Access to materials for the period specified in the course description</li>
                      <li>Materials available in digital form on the platform indicated by the seller</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Withdrawal from Contract</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>A consumer has the right to withdraw from the contract within 14 days from its conclusion without giving a reason.</li>
                  <li>The right of withdrawal does not apply in case of:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Services fully performed with consumer&apos;s consent before the withdrawal period expires</li>
                      <li>Digital content not delivered on a tangible medium, if performance began with consumer&apos;s consent</li>
                      <li>Services started before the withdrawal period expires with consumer&apos;s consent</li>
                    </ul>
                  </li>
                  <li>To withdraw from the contract, a statement should be sent to the seller&apos;s e-mail address.</li>
                  <li>Payment refund occurs within 14 days of receiving the withdrawal statement.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Complaints</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Complaints can be filed in case of service non-compliance with the contract or regulations.</li>
                  <li>Complaints should be directed to e-mail address: slaviksemkiv12@gmail.com</li>
                  <li>The complaint should include: problem description, contact details, order number.</li>
                  <li>The seller considers complaints within 14 business days.</li>
                  <li>Response to the complaint is sent to the e-mail address indicated in the complaint.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Liability</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The seller is liable for service compliance with the contract and regulations.</li>
                  <li>The seller is not liable for:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Website interruptions caused by independent failures</li>
                      <li>Inability to participate in training due to buyer&apos;s reasons</li>
                      <li>Damages resulting from improper use of training materials</li>
                    </ul>
                  </li>
                  <li>The seller&apos;s liability is limited to the amount of the paid price.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Copyright</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>All training materials, recipes, and content are protected by copyright.</li>
                  <li>The buyer receives the right to use materials exclusively for their own needs.</li>
                  <li>Copying, distributing, and sharing materials with third parties is prohibited.</li>
                  <li>Copyright infringement may result in compensation claims.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Personal Data Protection</h2>
                <p className="text-gray-700 leading-relaxed ml-4">
                  The seller processes buyers&apos; personal data in accordance with the Privacy Policy available on the website, 
                  based on applicable law, including GDPR.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Final Provisions</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The seller reserves the right to change the regulations. Changes take effect after publication on the website.</li>
                  <li>In matters not regulated by the regulations, the provisions of the Civil Code apply.</li>
                  <li>Polish law applies to contracts concluded with consumers.</li>
                  <li>The regulations take effect on January 1, 2025.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Seller Contact Details</h2>
                <div className="text-gray-700 leading-relaxed ml-4 bg-gray-50 p-4 rounded-lg">
                  <p><strong>Yaroslav Semkiv &quot;Unknown Baker&quot;</strong></p>
                  <p>ul. Franciszka Adolfa Achera 9/U1</p>
                  <p>02-495 Warsaw</p>
                  <p>NIP: 5272748962</p>
                  <p>REGON: 528678087</p>
                  <p>E-mail: slaviksemkiv12@gmail.com</p>
                  <p>Account number: 08 1160 2202 0000 0006 2929 4950</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
