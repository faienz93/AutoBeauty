# AutoBeauty 🚗

> Un'applicazione gratuita e open-source per tracciare la cronologia di manutenzione del tuo veicolo. Tieni traccia di servizi, cambi gomme e revisioni tutto in un unico posto.

> A free and open-source application to track your vehicle maintenance history. Keep records of services, tire changes, and inspections all in one place.

## 💝 Supporta il Progetto / Support the Project

**AutoBeauty è completamente gratuita, ma lo sviluppo richiede tempo e dedizione!**
**AutoBeauty is completely free, but development requires time and dedication!**

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/faienz93)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/afaienza93)

**Ogni supporto, piccolo o grande, è molto apprezzato e aiuta a mantenere il progetto vivo!**
**Every support, big or small, is greatly appreciated and helps keep the project alive!**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

---

## 📋 Indice / Table of Contents

### Italiano

- [Caratteristiche](#-caratteristiche)
- [Requisiti](#-requisiti)
- [Installazione](#-installazione)
- [Configurazione](#-configurazione)
- [Utilizzo](#-utilizzo)
- [Tecnologie Utilizzate](#️-tecnologie-utilizzate)
- [Supporta il Progetto](#-supporta-il-progetto)
- [Licenza](#-licenza)
- [Contribuzioni](#-contribuzioni)
- [Roadmap](#-roadmap)

### English

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Built With](#️-built-with)
- [Support the Project](#-support-the-project)
- [License](#-license)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)

---

## 🇮🇹 VERSIONE ITALIANA

## ✨ Caratteristiche

### Tracciamento Eventi di Manutenzione

- **Tagliando regolare**: Tieni traccia delle manutenzioni periodiche
- **Cambio gomme**: Registra sostituzioni e rotazioni pneumatici
- **Revisioni**: Monitora le scadenze delle revisioni obbligatorie
- **Note dettagliate**: Aggiungi note e costi per ogni manutenzione
- **Chilometraggio**: Traccia il chilometraggio per ogni servizio

### Gestione Dati

- **Import CSV**: Importa i record di manutenzione da file CSV
- **Export dati**: Esporta i tuoi dati per backup
- **Persistenza cross-platform**: Utilizza PouchDB per la sincronizzazione
- **Funzionamento offline**: Disponibile su web e dispositivi mobili anche senza connessione

### Interfaccia Utente

- **Design pulito**: Interfaccia Ionic React intuitiva
- **Mobile-first**: Progettato prima per dispositivi mobili
- **Modalità scura**: Supporto per tema scuro
- **Layout responsive**: Si adatta a qualsiasi dimensione schermo

## 🔧 Requisiti

- **Node.js**: versione 22.13.1 o superiore
- **npm**: per la gestione delle dipendenze

## 🚀 Installazione

1. **Clona il repository**

   ```bash
   git clone https://github.com/faienz93/AutoBeauty.git
   cd autobeauty
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

## ⚙️ Configurazione

1. **Crea il file di configurazione**

   Crea un file `.env` nella root del progetto:

   ```env
   # Configurazione di esempio per .env
   VITE_ENV_NAME=TEST
   VITE_TEST_CAR_TABLE=car
   VITE_TEST_KM_TABLE=km
   ```

2. **Personalizza i valori** secondo le tue esigenze specifiche.

## 🎯 Utilizzo

**Avvia il server di sviluppo:**

```bash
npm run dev
```

L'applicazione sarà disponibile su [http://localhost:5173](http://localhost:5173) (o sulla porta indicata da Vite).

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React + TypeScript
- **Framework UI**: Ionic Framework
- **Database**: PouchDB per la persistenza dati
- **Build Tool**: Vite
- **Styling**: CSS/SCSS con componenti Ionic

---

## 🌟 Altri Modi per Supportare

- **Metti una stella al repository / Star the repository** ⭐
- **Segnala bug e problemi / Report bugs and issues** 🐛
- **Proponi nuove funzionalità / Submit feature requests** 💡
- **Contribuisci al codice / Contribute code** 👨‍💻
- **Condividi l'app / Share the app** con altri appassionati di auto 🚗

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT** - vedi il file [LICENSE](LICENSE) per i dettagli.

### Cosa significa?

- ✅ Uso commerciale consentito
- ✅ Modifica consentita
- ✅ Distribuzione consentita
- ✅ Uso privato consentito
- ⚠️ Richiesta attribuzione dell'autore originale

## 🗺️ Roadmap

### ✅ Completato

- [x] Semplificazione inserimento dati
- [x] Fix routing aggiornamento elementi
- [x] Aggiunta template.csv per import
- [x] Fix download maintenance.csv
- [x] Fix link supporto
- [x] Icone migliorate per Android

### 🔄 In Sviluppo

- [ ] Integrazione Sentry per bug tracking
- [ ] Fix loader al primo avvio
- [ ] Ottimizzazione immagini Unsplash
- [ ] Supporto Multilingua
- [ ] Aggiungere altre automobili

---

## 🇬🇧 ENGLISH VERSION

## ✨ Features

### Maintenance Event Tracking

- **Regular service**: Track periodic maintenance schedules
- **Tire changes**: Record tire replacements and rotations
- **Vehicle inspections**: Monitor mandatory inspection deadlines
- **Detailed notes**: Add notes and costs for each maintenance
- **Mileage tracking**: Track mileage for every service

### Data Management

- **CSV Import**: Import maintenance records from CSV files
- **Data Export**: Export your data for backup purposes
- **Cross-platform persistence**: Uses PouchDB for synchronization
- **Offline functionality**: Available on web and mobile devices without connection

### User Interface

- **Clean design**: Intuitive Ionic React interface
- **Mobile-first**: Designed primarily for mobile devices
- **Dark mode**: Dark theme support
- **Responsive layout**: Adapts to any screen size

## 🔧 Requirements

- **Node.js**: version 22.13.1 or higher
- **npm**: for dependency management

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/faienz93/AutoBeauty.git
   cd autobeauty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Create configuration file**

   Create a `.env` file in the project root:

   ```env
   # .env example configuration
   VITE_ENV_NAME=TEST
   VITE_TEST_CAR_TABLE=car
   VITE_TEST_KM_TABLE=km
   ```

2. **Customize values** according to your specific needs.

## 🎯 Usage

**Start the development server:**

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) (or the port indicated by Vite).

## 🛠️ Built With

- **Frontend**: React + TypeScript
- **UI Framework**: Ionic Framework
- **Database**: PouchDB for data persistence
- **Build Tool**: Vite
- **Styling**: CSS/SCSS with Ionic components

---

## 💝 Support the Project

**AutoBeauty is completely free, but development requires time and dedication!**

### ☕ Buy Me a Coffee

If you find this app useful, consider supporting its development:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/faienz93)

### 🌟 Other Ways to Support

- **Star** the repository ⭐
- **Report bugs** and issues 🐛
- **Submit feature requests** 💡
- **Contribute code** 👨‍💻
- **Share** the app with other car enthusiasts 🚗

**Every support, big or small, is greatly appreciated and helps keep the project alive!**

## 📄 License

This project is released under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What does this mean?

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Attribution to original author required

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

---

## 🌟 Other Ways to Support

...

## 🗺️ Roadmap

### ✅ Completed

- [x] Simplified form entry
- [x] Fixed item update routing
- [x] Added import template.csv
- [x] Fixed maintenance.csv download
- [x] Fixed support link
- [x] Improved Android icons

### 🔄 In Development

- [ ] Sentry integration for bug tracking
- [ ] Fix loader on first app startup
- [ ] Optimize Unsplash images
- [ ] Multilingual support
- [ ] Add more cars

---

## 👨‍💻 Autore / Author

Realizzato con ❤️ da appassionati di auto per appassionati di auto
Made with ❤️ by car enthusiasts for car enthusiasts

**Mantieni la tua auto sempre in perfetta forma! 🚗✨**
**Keep your car running smoothly! 🚗✨**

---

## 📞 Contatti / Contact

Per domande, suggerimenti o supporto, non esitare a contattarmi!
For questions, suggestions, or support, don't hesitate to contact me!

---

_AutoBeauty - Il tuo compagno digitale per la manutenzione auto_
_AutoBeauty - Your digital companion for car maintenance_
