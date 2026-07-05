# Rozepiš — marketingový web

Statický web služby **Rozepiš**: z pár minut myšlenek týmu děláme pravidelný LinkedIn obsah pro osobní profily celé firmy.

Bez build-stepu, bez frameworku — čisté HTML + CSS + trocha vanilla JS. Nasadí se pouhým nahráním souborů (GitHub Pages, Netlify, Cloudflare Pages, Vercel).

## Struktura

```
/
├── index.html                      # onepager (hero, problém, jak to funguje, páka týmu,
│                                   #   ukázky, srovnání, zakladatel, ceník, FAQ, CTA formulář)
├── ukazky/index.html               # galerie ukázek před / po
├── cenik/index.html                # detailní ceník + FAQ k ceně
├── ochrana-osobnich-udaju/         # GDPR (noindex)
├── obchodni-podminky/              # obchodní podmínky (noindex)
├── 404.html
├── robots.txt, sitemap.xml
├── favicon.svg
└── assets/
    ├── css/
    │   ├── tokens.css              # barvy, typografie, rozměry — JEDINÉ místo pravdy
    │   └── main.css                # komponenty a layout
    ├── js/main.js                  # nav, scroll animace, odeslání formuláře
    ├── fonts/                      # self-hosted woff2 (Space Grotesk, Inter, IBM Plex Mono)
    └── img/og.svg                  # zdroj OG obrázku (nutno vyexportovat do og.png — viz níže)
```

## Lokální náhled

Otevřete `index.html` v prohlížeči, nebo spusťte jednoduchý server (kvůli čistým URL adresám `/ukazky/`, `/cenik/`):

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Barvy a značka na jednom místě

Vše laditelné je v [`assets/css/tokens.css`](assets/css/tokens.css). Chcete jinou akcentní barvu? Změňte `--accent`. Název „Rozepiš" je v textu stránek (`.brand__mark`).

- Akcent: inkoustová modrá `#1B3A6B`
- Signální žlutá `#F2C230` — jen pro „surový vstup" (post-it logika)
- LinkedIn modř `#0A66C2` — výhradně uvnitř mock-upů postů, nikde v UI webu

## Než web pustíte ven — co doplnit

Web je vyplněný tak, aby působil hotově. Část hodnot je ale **vymyšlená** a je potřeba je ověřit,
část se musí **technicky dodělat**.

### A) Technicky dodělat (bez toho web plně nefunguje)

1. **Formulářový endpoint** — v [`assets/js/main.js`](assets/js/main.js) nastavte `FORM_ENDPOINT`
   (Formspark / Formspree / Resend). Dokud je prázdný, formulář jen *simuluje* úspěch pro náhled
   a reálně nic neodešle.
2. **OG obrázek** — vyexportujte `assets/img/og.svg` → `assets/img/og.png` (1200×630 px).
   Meta tagy už na `og.png` odkazují. (SVG sociální sítě nerenderují.)
   Otevřete `og.svg` v prohlížeči / Figmě / Inkscape a uložte jako PNG.
3. **Analytika** — odkomentovat Plausible v `<head>` (bez cookies → bez cookie lišty).
4. **Doména** — v kódu je `https://rozepis.cz` (canonical, OG, sitemap). Upravit dle skutečné domény.

### B) Vymyšlené hodnoty — ověřit / přepsat (upravíme později)

Tyto věci jsou předvyplněné realistickými návrhy, aby web nevypadal rozpracovaně:

- **Zakladatel** — jméno „Lukáš Doleček", monogram „LD" místo fotky, odkaz na LinkedIn
  (sekce „Kdo za tím stojí"). Doplnit reálnou fotku a správný profil.
- **Reference** — citace „Tomáš Bervida, Kovovýroba Haná s.r.o." je vymyšlená; nahradit reálnou
  (nebo dočasně skrýt).
- **Ukázky postů** — vzorové posty nahradit anonymizovanými ukázkami z pilotního klienta
  (nejcennější obsah webu).
- **Ceník** — částky 9 900 / 19 900 Kč potvrdit.
- **Patička / právní** — IČO `17654321`, sídlo „Nádražní 42, 750 02 Přerov", e-mail
  `ahoj@rozepis.cz`, plátcovství DPH, lhůty v GDPR i obchodních podmínkách. Vše ověřit.
- **Calendly** — odkaz `calendly.com/rozepis/uvod-20-min` nahradit reálným.

## Nasazení na GitHub Pages s vlastní doménou

1. V nastavení repozitáře → Pages zvolte zdroj (branch `main`, složka `/`).
2. Pro vlastní doménu přidejte soubor `CNAME` s doménou (např. `rozepis.cz`) do kořene
   a nastavte DNS. (Nedávám ho sem, aby nekolidoval s tvou skutečnou doménou.)
3. Root-absolutní odkazy (`/ukazky/`, `/assets/...`) fungují na vlastní doméně.
   Na `username.github.io/repo/` by se musely upravit na relativní.

## Přístupnost a výkon

- Self-hosted fonty s `font-display: swap`, `prefers-reduced-motion` respektováno.
- Kontrast AA, focus stavy, formuláře s labely, skip-link.
- Žádné cookies, žádné externí sledování → bez cookie lišty.

## Licence

MIT — viz [LICENSE](LICENSE).
