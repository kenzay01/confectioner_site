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
                <p className="text-gray-700 mb-4 font-semibold">Yaroslav Semkiv „Nieznany Piekarz”</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Postanowienia ogólne</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Niniejszy Regulamin określa zasady korzystania ze strony internetowej oraz zasady zakupu i realizacji usług szkoleniowych oferowanych przez Administratora.</li>
                  <li>Administratorem i sprzedawcą usług szkoleniowych jest:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Yaroslav Semkiv „Nieznany Piekarz”</li>
                      <li>Forma prawna: przedsiębiorca wpisany do CEIDG</li>
                      <li>NIP: 5272748962</li>
                      <li>REGON: 528678087</li>
                      <li>Adres: ul. Aleksandra Gieysztora 4/18, 02-999 Warszawa</li>
                      <li>E-mail: slaviksemkiv12@gmail.com</li>
                    </ul>
                  </li>
                  <li>Regulamin udostępniany jest nieodpłatnie w sposób umożliwiający jego pobranie, zapisanie i wydrukowanie.</li>
                  <li>Zakup szkolenia oznacza akceptację Regulaminu.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Definicje</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Klient/Użytkownik</strong> – osoba korzystająca ze strony i kupująca szkolenie</li>
                  <li><strong>Administrator/Sprzedawca</strong> – Yaroslav Semkiv „Nieznany Piekarz”</li>
                  <li><strong>Szkolenie</strong> – usługa edukacyjna stacjonarna lub online</li>
                  <li><strong>Umowa</strong> – umowa zawarta pomiędzy Klientem a Administratorem</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Zakres usług</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator prowadzi sprzedaż szkoleń stacjonarnych i online.</li>
                  <li>Opisy szkoleń, program oraz ceny znajdują się na stronie.</li>
                  <li>Ceny podane na stronie są cenami brutto.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Wymagania techniczne</h2>
                <p className="text-gray-700 mb-2 ml-4">Do korzystania ze szkoleń online wymagane jest:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8">
                  <li>urządzenie z dostępem do Internetu</li>
                  <li>aktualna przeglądarka internetowa</li>
                  <li>aktywny adres e-mail</li>
                  <li>łącze internetowe min. 5 Mb/s</li>
                </ul>
                <p className="text-gray-700 mt-2 ml-4">Administrator nie odpowiada za problemy techniczne po stronie Klienta.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Zasady składania zamówień</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Zamówienia składane są poprzez formularz na stronie internetowej.</li>
                  <li>Klient zobowiązany jest do podania prawdziwych danych.</li>
                  <li>Po złożeniu zamówienia Klient otrzymuje potwierdzenie e-mail.</li>
                  <li>Umowa zostaje zawarta z chwilą potwierdzenia zamówienia.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Płatności</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Płatności dokonywane są poprzez system płatności elektronicznych lub przelew bankowy.</li>
                  <li>Brak płatności może skutkować anulowaniem zamówienia.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Realizacja usług</h2>

                <h3 className="text-lg font-semibold mb-2 mt-4">Szkolenia stacjonarne</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Udział możliwy jest wyłącznie po dokonaniu płatności.</li>
                  <li>Uczestnik zobowiązany jest do przestrzegania zasad BHP oraz poleceń prowadzącego.</li>
                  <li>Administrator nie ponosi odpowiedzialności za szkody wyrządzone przez Uczestnika.</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 mt-4">Zasady BHP</h3>
                <p className="text-gray-700 mb-2 ml-4">Uczestnik zobowiązany jest do:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8">
                  <li>noszenia odzieży ochronnej (fartuch, obuwie robocze)</li>
                  <li>zabezpieczenia włosów</li>
                  <li>nienoszenia biżuterii stanowiącej zagrożenie</li>
                  <li>nieobsługiwania urządzeń bez instruktażu</li>
                  <li>zachowania ostrożności przy pracy z gorącymi elementami i narzędziami</li>
                  <li>zgłaszania zagrożeń</li>
                </ul>
                <p className="text-gray-700 mt-2 ml-4">Zakazane jest uczestnictwo pod wpływem alkoholu lub środków odurzających.</p>
                <p className="text-gray-700 mt-2 ml-4">Naruszenie zasad może skutkować usunięciem ze szkolenia bez zwrotu kosztów.</p>

                <h3 className="text-lg font-semibold mb-2 mt-4">Alergeny</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Podczas szkoleń używane są produkty zawierające m.in.: gluten, jaja, mleko, orzechy, sezam, soję, kakao, miód.</li>
                  <li>Nie ma możliwości wykluczenia zanieczyszczeń krzyżowych.</li>
                  <li>Uczestnik zobowiązany jest zgłosić alergie minimum 48 godzin przed szkoleniem.</li>
                  <li>Administrator nie ponosi odpowiedzialności za reakcje wynikające z braku zgłoszenia.</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 mt-4">Szkolenia online</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Dostęp do materiałów udzielany jest po zaksięgowaniu płatności.</li>
                  <li>Materiały cyfrowe nie podlegają zwrotowi.</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 mt-4">Zmiana terminu przez Administratora</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator może zmienić termin szkolenia z przyczyn niezależnych.</li>
                  <li>Klient ma prawo do: udziału w nowym terminie lub pełnego zwrotu środków.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Odstąpienie od umowy i rezygnacja</h2>

                <h3 className="text-lg font-semibold mb-2 mt-4">Brak prawa odstąpienia</h3>
                <p className="text-gray-700 ml-4">
                  Zgodnie z art. 38 pkt 12 ustawy o prawach konsumenta, Klientowi nie przysługuje prawo odstąpienia od umowy, ponieważ szkolenie jest usługą związaną z wydarzeniem odbywającym się w określonym terminie.
                </p>

                <h3 className="text-lg font-semibold mb-2 mt-4">Brak możliwości rezygnacji</h3>
                <p className="text-gray-700 mb-2 ml-4">Po zakupie szkolenia:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8">
                  <li>nie ma możliwości rezygnacji</li>
                  <li>nie przysługuje zwrot środków</li>
                  <li>nieobecność nie stanowi podstawy do zwrotu</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 mt-4">Przeniesienie miejsca</h3>
                <p className="text-gray-700 ml-4">
                  Możliwe jest przekazanie miejsca innej osobie do 48 godzin przed szkoleniem.
                </p>

                <h3 className="text-lg font-semibold mb-2 mt-4">Zmiana terminu przez Klienta</h3>
                <p className="text-gray-700 ml-4">
                  Zmiana terminu możliwa wyłącznie za zgodą Administratora.
                </p>

                <h3 className="text-lg font-semibold mb-2 mt-4">Szkolenia online</h3>
                <p className="text-gray-700 ml-4">
                  Po uzyskaniu dostępu do materiałów Klient traci prawo odstąpienia od umowy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Reklamacje</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Reklamacje można zgłaszać do 7 dni po szkoleniu.</li>
                  <li>Administrator rozpatruje je w ciągu 14 dni.</li>
                  <li>Reklamacje nie obejmują subiektywnych odczuć ani braku efektów.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Prawa autorskie</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Materiały są chronione prawem autorskim.</li>
                  <li>Zakazane jest kopiowanie i rozpowszechnianie.</li>
                  <li>Klient otrzymuje licencję na użytek własny.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Wizerunek</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Uczestnik może wyrazić zgodę na wykorzystanie wizerunku.</li>
                  <li>Zgoda jest dobrowolna i może zostać wycofana w dowolnym momencie (bez wpływu na wcześniejsze wykorzystanie).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Dane osobowe (RODO)</h2>
                <p className="text-gray-700 mb-3 ml-4">Administratorem danych jest Yaroslav Semkiv „Nieznany Piekarz”.</p>
                <p className="text-gray-700 mb-2 ml-4">Dane przetwarzane są w celu:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8 mb-3">
                  <li>realizacji umowy</li>
                  <li>kontaktu</li>
                  <li>obowiązków prawnych</li>
                  <li>marketingu (za zgodą)</li>
                </ul>
                <p className="text-gray-700 mb-2 ml-4">Zakres danych: imię, nazwisko, e-mail, telefon, dane do faktury</p>
                <p className="text-gray-700 mb-2 ml-4">Dane przechowywane są:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8 mb-3">
                  <li>przez czas trwania umowy</li>
                  <li>do przedawnienia roszczeń</li>
                  <li>zgodnie z przepisami podatkowymi</li>
                </ul>
                <p className="text-gray-700 mb-2 ml-4">Dane mogą być przekazywane:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8 mb-3">
                  <li>księgowości</li>
                  <li>operatorom płatności</li>
                  <li>dostawcom IT</li>
                </ul>
                <p className="text-gray-700 mb-2 ml-4">Klient ma prawo do:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-8 mb-3">
                  <li>dostępu do danych</li>
                  <li>poprawiania</li>
                  <li>usunięcia</li>
                  <li>ograniczenia przetwarzania</li>
                  <li>sprzeciwu</li>
                  <li>cofnięcia zgody</li>
                </ul>
                <p className="text-gray-700 mb-2 ml-4">Może również złożyć skargę do UODO.</p>
                <p className="text-gray-700 mb-2 ml-4">Podanie danych jest dobrowolne, ale konieczne do realizacji usługi.</p>
                <p className="text-gray-700 ml-4">Dane nie są profilowane.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Postanowienia końcowe</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Administrator zastrzega sobie prawo do zmiany Regulaminu.</li>
                  <li>W sprawach nieuregulowanych obowiązuje prawo polskie.</li>
                  <li>Regulamin obowiązuje od dnia publikacji.</li>
                </ol>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. General provisions</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>These Terms define the rules for using the website and for purchasing and receiving training services offered by the Administrator.</li>
                  <li>The Administrator and seller of training services is Yaroslav Semkiv &quot;Unknown Baker&quot;, sole proprietor entered in CEIDG, NIP: 5272748962, REGON: 528678087, address: ul. Aleksandra Gieysztora 4/18, 02-999 Warsaw, e-mail: slaviksemkiv12@gmail.com.</li>
                  <li>The Terms are provided free of charge in a form that allows downloading, saving and printing.</li>
                  <li>Purchasing training constitutes acceptance of these Terms.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Client/User</strong> – a person using the website and purchasing training.</li>
                  <li><strong>Administrator/Seller</strong> – Yaroslav Semkiv &quot;Unknown Baker&quot;.</li>
                  <li><strong>Training</strong> – on-site or online educational service.</li>
                  <li><strong>Contract</strong> – agreement between the Client and the Administrator.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Scope of services</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Administrator sells on-site and online training.</li>
                  <li>Descriptions, programme and prices are on the website.</li>
                  <li>Prices on the website are gross prices.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Technical requirements</h2>
                <p className="text-gray-700 mb-2 ml-4">For online training you need: a device with internet access, an up-to-date browser, an active e-mail address, and internet at least 5 Mb/s.</p>
                <p className="text-gray-700 ml-4">The Administrator is not liable for technical issues on the Client&apos;s side.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Orders</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Orders are placed via the form on the website.</li>
                  <li>The Client must provide accurate data.</li>
                  <li>After placing an order, the Client receives e-mail confirmation.</li>
                  <li>The contract is concluded upon confirmation of the order.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Payments</h2>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Payments are made via electronic payment systems or bank transfer. Failure to pay may result in cancellation of the order.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Performance</h2>
                <p className="text-gray-700 mb-2 ml-4"><strong>On-site training:</strong> participation only after payment; participants must follow health and safety rules and the instructor&apos;s instructions; the Administrator is not liable for damage caused by a participant.</p>
                <p className="text-gray-700 mb-2 ml-4"><strong>Health and safety:</strong> protective clothing, secured hair, no hazardous jewellery, no equipment without briefing, caution with heat and tools, report hazards; no participation under the influence of alcohol or drugs; breach may lead to removal without refund.</p>
                <p className="text-gray-700 mb-2 ml-4"><strong>Allergens:</strong> products may contain e.g. gluten, eggs, milk, nuts, sesame, soy, cocoa, honey; cross-contamination cannot be excluded; allergies must be reported at least 48 hours before training; the Administrator is not liable for reactions if not reported.</p>
                <p className="text-gray-700 mb-2 ml-4"><strong>Online training:</strong> access after payment is credited; digital materials are non-refundable.</p>
                <p className="text-gray-700 ml-4"><strong>Date change by Administrator:</strong> the date may be changed for reasons beyond the Administrator&apos;s control; the Client may attend on the new date or receive a full refund.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Withdrawal and cancellation</h2>
                <p className="text-gray-700 mb-2 ml-4">Under Article 38(12) of the Polish Consumer Rights Act, the Client has no statutory right of withdrawal, as training is a service tied to an event on a specific date.</p>
                <p className="text-gray-700 mb-2 ml-4">After purchase: cancellation is not possible; no refund; absence is not grounds for refund. A place may be transferred to another person up to 48 hours before training. A date change by the Client is only possible with the Administrator&apos;s consent.</p>
                <p className="text-gray-700 ml-4">For online training, after access to materials is granted, the right of withdrawal is lost.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Complaints</h2>
                <p className="text-gray-700 ml-4">
                  Complaints may be filed within 7 days after training. The Administrator will respond within 14 days. Complaints do not cover subjective impressions or lack of results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Copyright</h2>
                <p className="text-gray-700 ml-4">
                  Materials are protected by copyright; copying and distribution are prohibited. The Client receives a licence for personal use only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Image</h2>
                <p className="text-gray-700 ml-4">
                  Participants may consent to use of their image. Consent is voluntary and may be withdrawn at any time (without affecting prior use).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Personal data (GDPR)</h2>
                <p className="text-gray-700 mb-2 ml-4">
                  The data controller is Yaroslav Semkiv &quot;Unknown Baker&quot;. Data are processed for contract performance, contact, legal obligations and marketing (with consent). Scope: name, surname, e-mail, phone, invoicing data. Data may be shared with accounting, payment operators and IT providers. You have rights of access, rectification, erasure, restriction, objection and withdrawal of consent, and may lodge a complaint with the Polish supervisory authority (UODO). Providing data is voluntary but necessary to provide the service. No profiling is performed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Final provisions</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>The Administrator reserves the right to amend these Terms.</li>
                  <li>Polish law applies to matters not covered herein.</li>
                  <li>These Terms apply from the date of publication.</li>
                </ol>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
