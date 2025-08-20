# AutoBeauty 🚗

A free and open-source application to track your vehicle maintenance history. Keep records of services, tire changes, and inspections all in one place.

## Node version

```
v22.13.1
```

## Getting Started 🚀

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Crea un file `.env` nella root del progetto. Esempio di configurazione:

   ```
   # .env example
   VITE_ENV_NAME=TEST
   VITE_TEST_CAR_TABLE=car
   VITE_TEST_KM_TABLE=km
   ```

   Modifica i valori secondo le tue esigenze.

4. Avvia il server di sviluppo:
   ```
   npm run dev
   ```
   L'app sarà disponibile su [http://localhost:5173](http://localhost:5173) (o la porta indicata da Vite).

## Features ✨

- Track Maintenance Events
  - Regular service (Tagliando)
  - Tire changes (Gomme)
  - Vehicle inspections (Revisione)
  - Add notes and costs for each maintenance
  - Track mileage for each service
- Data Management
  - Import maintenance records from CSV
  - Export your data for backup
  - Cross-platform data persistence using PouchDB
  - Works offline on web and mobile devices
- User Interface
  - Clean and intuitive Ionic React interface
  - Mobile-first design
  - Dark mode support
  - Responsive layout

## Getting Started 🚀

1. Clone the repository
2. Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

## Built With 🛠️

- React + TypeScript
- Ionic Framework
- PouchDB for data storage
- Vite for build tooling

## Support the Project ☕

If you find this app useful, consider supporting its development:

<img alt="&quot;Buy Me A Coffee&quot;" src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png">

Other ways to support:

- Star the repository ⭐
- Report bugs 🐛
- Submit feature requests 💡
- Contribute to the code 👨‍💻

## License 📝

This project is completely free and open source. Feel free to use it, modify it, and share it!

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## TODO

- [x] Simplyfy form entry
- [x] Fix when update item routing
- [x] Add import template.csv
- [x] Fix when try to download maintenance.csv
- [x] Fix Link of support
- [ ] Add sentry for bug
- [x] Added better icon for android
- [ ] Fix loader when start the app for the first ime
- [ ] Fix too heavy unsplash images
- [ ] Fix Readme

---

Made with ❤️ by car enthusiasts for car enthusiasts
Keep your car running smoothly! 🚗✨
