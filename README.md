# Specifica funzionale e tecnica — "Project: Aurora"

Versione: 0.1
Autore: Paol0B
Data: 2025-09-02

Sommario esecutivo
------------------
Obiettivo: realizzare un browser desktop "ultra‑lightweight" con interfaccia futuristica sviluppata in Nuxt 4, forte orientamento alla privacy e sicurezza, esperienza d'uso semplice e immediata. L'interfaccia sarà separata dal motore che carica contenuti esterni; la comunicazione avverrà tramite IPC sicuro. Priorità per MVP: leggerezza, privacy-by-default, compatibilità base con siti moderni.

Ambito e non-ambito
-------------------
Incluso:
- Desktop: Windows, macOS, Linux (prima iterazione).
- UI in Nuxt 4 (SPA/static), servita localmente.
- Backend/shell nativo che orchestri il motore di rendering (CEF/Gecko/engine di sistema).
- Funzionalità privacy fondamentali: ad/tracker blocking, cookie isolation, container tabs, fingerprinting mitigations base.
- Aggiornamenti firmati e meccanismo di sicurezza per build.

Escluso (non per MVP):
- Supporto nativo mobile (Android/iOS) — valutare dopo MVP.
- Supporto estensioni WebExtensions nella prima versione (opzione futura).
- DRM proprietario e codec con royalty (H.264/HEVC) salvo necessità.
- Sync E2E (post‑beta).

Obiettivi misurabili
--------------------
- Startup UI: ≤ 500 ms (cold start target su HW moderno).
- Memoria media per tab: target < 150 MB/tab (valutare in funzione del motore).
- Time To First Paint (TTFP) pagina semplice: < 1 s.
- Telemetria: off di default; tasso di crash ≤ 0.5% su beta.
- Privacy: default blocco third‑party tracker, third‑party cookies disabilitati.

Scelte architetturali chiave
----------------------------
- UI layer: Nuxt 4 (SPA/static). Build e bundle assets locali, nessun CDN esterno.
- Packaging consigliato per produzione: Tauri (minore footprint). PoC rapido: Electron.
- Process model: multiprocesso - 1 processo UI (Nuxt shell), n processi content sandboxed (motore).
- Motore rendering: inizialmente WebView di sistema (WebView2 su Windows, WKWebView su macOS) o Gecko/CEF per compatibilità maggiore; decisione definitiva dopo analisi compatibilità dei top N siti.
- Comunicazione: IPC locale (socket unix / named pipe / platform channel) con autenticazione handshake e token ephemeral.
- Privacy filter: filtro a livello di rete gestito dal backend (local proxy o hook in networking stack) per bloccare tracker e mitigare fingerprinting.

Componenti e responsabilità
---------------------------
1. UI (Nuxt 4 SPA)
   - Omnibox (URL + comandi rapidi), shimmered tabs, dashboard privacy, impostazioni, pagina errori TLS.
   - Serve solo interfaccia, non esegue contenuti di terze parti.
   - CSP rigorosa, bundle locale, nessun inline script permettente eval.

2. Shell / Backend nativo (Tauri/Electron/SDK)
   - Espone API IPC alla UI per operazioni di controllo (openURL, newTab, closeTab, setPolicy).
   - Gestisce motore di rendering esterno (spawn/monitor dei content processes).
   - Implementa tracker blocker, gestione cookie/container, storage sicuro, aggiornamenti.
   - Autenticazione locale e protezione della superficie IPC.

3. Motori di rendering content (processi sandbox)
   - Caricano pagine web esterne. Fortemente sandboxati con privilegi minimi.
   - Isolamento per tab (sessioni separate o container).
   - Policy per plugin/codec: caricati solo on demand.

4. Storage e sicurezza
   - Storage cifrato per password preferibilmente (post‑beta).
   - Cookie jar per container; sessioni ephemeral per modalità privacy.
   - Update manager con signature verification.

5. Privacy Engine / Network Filter
   - Filtro basato su blocklists (aggiornabili), plus heuristics per fingerprint mitigation.
   - Modalità Tor/VPN opzionale (valutare impatto e dipendenze legali).

Requisiti funzionali (FR)
-------------------------
FR-01: Avvio UI minimale con omnibox, schede e area contenuto.
FR-02: Apertura URL, navigazione avanti/indietro, reload.
FR-03: Tab management: apri/chiudi/rinomina, sospendi tab inattivi.
FR-04: Container tabs: isolare storage/cookie/localStorage per container.
FR-05: Tracker & ad blocking integrato, con dashboard che mostra blocchi per sito.
FR-06: Protezione TLS: visualizzazione chiara errori certificati, opzione avanzata per debug.
FR-07: Modalità Privacy (sessione non persistente).
FR-08: Per‑site permissions per camera/microfono/posizione/notifications.
FR-09: Download manager minimale (salva, cancella, resume).
FR-10: Aggiornamenti automatici firmati e rollout controllabile.
FR-11: Opzioni per fingerprinting mitigation (canvas prompt, timing fuzzing, WebGL limits).

Requisiti non funzionali (NFR)
-------------------------------
NFR-01: Telemetria disabilitata by default; opt‑in esplicito.
NFR-02: CSP per UI e isolamento del runtime (no nodeIntegration).
NFR-03: Packaging pienamente firmabile per macOS/Windows.
NFR-04: Compatibilità con top 50 siti target ≥ 90% senza intervento utente.
NFR-05: Compliance GDPR (privacy by design, data minimization).

Requisiti di sicurezza
----------------------
- Sandboxing processi content con privilege drop.
- Validazione e pinning selettivo dei certificati (policy), OCSP stapling.
- Aggiornamenti firmati, rollback sicuro.
- Dependency scanning e vulnerability monitoring (SCA).
- Pipeline di fuzzing per network parser/HTML/JS interfaces.
- Bug bounty e divulgazione responsabile.

API IPC proposta (contratto ad alto livello)
--------------------------------------------
Nota: definire nomi finali e formati payload nella fase di design API.
- openURL({url, newTab?: bool, container?: id}) -> {tabId, status}
- navigateTab({tabId, url}) -> {status, tlsInfo?}
- closeTab({tabId}) -> {status}
- listTabs() -> [{tabId, title, url, container, status}]
- setPolicy({policyName, value}) -> {status}
- getPrivacyStats() -> {blockedTrackers, blockedConnections, blockedScripts}
- getSitePermissions({origin}) -> {permissions}
- setSitePermission({origin, permission, value}) -> {status}
- exportBookmarks() -> blob
- importBookmarks(blob) -> {status}
Sicurezza IPC:
- Connessioni local socket protette, handshake con token in memoria.
- Limitare esposizione: solo metodi necessari; non permettere esecuzione arbitraria di comandi shell.

Nuxt 4 — linee guida specifiche per UI
-------------------------------------
- Modalità di distribuzione: generare SPA/static assets (no fetch esterno per UI).
- Content Security Policy: default-src 'self'; disallow eval; no inline scripts.
- Non includere CDN esterni; bundle tutti gli asset.
- Disable server‑side rendered endpoints che accettano input non validato.
- Minimizzare plugin che usano eval o accesso al sistema.
- UI deve essere responsiva, accessibile, con temi (scuro + accenti neon) ma con opzioni di contrasto.

Design UX / UI requisiti
------------------------
- Omnibox unico con comandi rapidi (es. ":new containerName").
- Tabs sottili, minimal; preview on hover opzionale.
- Privacy dashboard accessibile con 1 click dal toolbar.
- Modalità "Focus" che nasconde elementi non essenziali.
- Micro‑animazioni leggère (GPU‑friendly) e feedback istantanei.
- Accessibilità: keyboard navigation, supporto screen readers, scaling fonts.

Test, QA e compatibilità
------------------------
- Includere Web Platform Tests (WPT) base per compatibilità DOM/CSS/Fetch/ServiceWorker.
- Test automatici di compatibilità per top 50 siti target (screenshot diff + behavioral tests).
- Performance tests: Speedometer, JetStream, custom memory/per‑tab tests.
- Security tests: fuzzing, SAST, DAST, dependency scanning.
- Regression test su blocklists per ridurre false positives che rompano siti.

Criteri di accettazione MVP
---------------------------
- UI avviabile e reattiva con omnibox e tab management.
- Possibilità di navigare e caricare siti comuni (top 20) senza crash.
- Tracker blocking attivo per default e dashboard che mostra almeno 3 categorie di blocchi.
- Cookie isolation per container tabs funzionante.
- Aggiornamenti firmati funzionanti in ambiente di test.
- Telemetria disabilitata per default.
- Documentazione tecnica minima (README architettura, guide build per dev).

Roadmap iniziale (0–6 mesi)
---------------------------
Sprint 0 (2 settimane)
- Definire top 50 siti target.
- Mockup UI high‑fidelity in Figma.
- Scelta tecnica: Tauri vs Electron (PoC decision).
Sprint 1 (4 settimane)
- PoC: Nuxt SPA caricata in Electron (prototipo UX).
- Backend minimale: IPC stub che apre URL in WebView separato.
- Implementare omnibox, tab UI e semplice navigation.
Sprint 2 (6 settimane)
- Integrare tracker blocking minimo (adlists locali).
- Implementare container tabs (isolamento cookie/localStorage).
- TLS handling UI e error pages.
Sprint 3 (6 settimane)
- Migrazione a Tauri (se deciso) e ottimizzazione footprint.
- Implementare update signed mechanism (test).
- Automazione build multi‑OS su CI.
Sprint 4 (8 settimane)
- Hardening security: sandboxing processes, CSP strict, SCA.
- Test compatibilità top 50 sites, fix regressions.
- Preparare alpha release e bug bounty program.

Checklist PoC (pragmatica)
--------------------------
- [ ] Creare mockup Omnibox + Tab UI + Privacy Dashboard.
- [ ] Generare Nuxt SPA con assets locali.
- [ ] Packaging PoC in Electron per test rapidi.
- [ ] Implementare backend stub che spawna webview per contenuti.
- [ ] Implementare IPC openURL/navigateTab/listTabs.
- [ ] Abilitare blocklist locale e mostrare count nella dashboard.
- [ ] Implementare cookie isolation per container tabs.
- [ ] Test su top 20 siti e registrare problemi.
- [ ] Decisione definitiva motore rendering per produzione.

Rischi principali e mitigazioni
-------------------------------
Rischio: Peso del binario (Electron) e non conformità a "ultra‑lightweight".
Mitigazione: PoC con Electron; produzione con Tauri o shell nativo.
Rischio: Compatibilità con siti moderni (media, DRM).
Mitigazione: scegliere motore adeguato dopo test top 50 e decidere fallback.
Rischio: Superficie di attacco ampliata da UI in web tech.
Mitigazione: CSP forte, isolamento UI vs content, no nodeIntegration, contextIsolation.
Rischio: Problemi legali per codec/DRM.
Mitigazione: evitare codec con royalties o utilizzare decoder di sistema dietro opt‑in.

Team e competenze richieste
---------------------------
- Product/UX designer (mockups, accessibilità).
- Frontend dev (Vue/Nuxt 4) per UI.
- Backend/native dev (Rust/C++/Go) per shell/Tauri integration.
- Security engineer (sandboxing, TLS, fuzzing).
- QA engineer (WPT, compat tests).
- DevOps (CI multi‑os, code signing, auto‑update infra).

Deliverables iniziali
---------------------
- Documento di specifica (questa versione).
- Mockups UI in Figma.
- Nuxt SPA PoC caricata in Electron.
- Backend IPC stub + simple webview content process.
- Test report per top 20 siti.
- Roadmap sprint‑by‑sprint per i primi 3 mesi.

Prossimi passi raccomandati
---------------------------
- Conferma target OS prioritari (Windows/macOS/Linux).
- Scegliere PoC packaging (Electron per rapidità, Tauri per leggerezza).
- Produrre mockup dettagliati e lista top 50 siti.
- Avviare PoC Nuxt + backend IPC e testare compatibilità.

Note legali e licenze
---------------------
- Valutare licenze dei motori (MPL per Gecko, BSD/Chromium, licenze WebView).
- Codec multimediali: valutare costi/licenze se richiesti.
- Definire policy privacy e documentazione GDPR/CCPA.

Appendice: elenco rapido di decisioni aperte
--------------------------------------------
- Motore rendering desktop definitivo (WebView2 vs CEF vs Gecko).
- Packaging produzione (Tauri vs shell nativo) — impatto su footprint.
- Politica estensioni: supportare WebExtensions o bloccarle inizialmente.
- Tor/VPN integrato o opzione esterna.
