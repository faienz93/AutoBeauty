# Ottimizzazioni delle Performance - Context e Tab

## Problemi Risolti

### 1. Context che si ricarica ad ogni render
**Problema**: Nel file `App.tsx` originale, venivano create nuove istanze dei servizi database ad ogni render del componente:

```tsx
// PRIMA - PROBLEMATICO
<MaintenanceDbCtx.Provider value={new MaintenanceDbService(envVar?.car_table)}>
  <KilometersDbCtx.Provider value={new KilometersDbService(envVar?.km_table)}>
```

**Soluzione**: 
1. **Istanze singleton**: Creazione delle istanze dei servizi una sola volta fuori dal componente
2. **useMemo**: Utilizzo di `useMemo` per garantire che i valori del context non cambino ad ogni render
3. **Hook personalizzati**: Creazione di hook per gestire meglio l'accesso ai context

### 2. Tab che si ri-renderizzano inutilmente
**Problema**: Le Tab venivano ri-renderizzate ad ogni cambio di stato del componente padre.

**Soluzione**: 
1. **React.memo**: Memoizzazione dei componenti Tab e Routes
2. **Separazione dei componenti**: Estrazione delle Tab e Routes in componenti separati e memoizzati

## Implementazione

### 1. Istanze Singleton dei Servizi
```tsx
// Crea le istanze dei servizi una sola volta fuori dal componente
const maintenanceDbInstance = new MaintenanceDbService(envVar?.car_table);
const kilometersDbInstance = new KilometersDbService(envVar?.km_table);

export const MaintenanceDbCtx = React.createContext(maintenanceDbInstance);
export const KilometersDbCtx = React.createContext(kilometersDbInstance);
```

### 2. Hook Personalizzati
```tsx
// src/hooks/useDbContext.tsx
export const useMaintenanceDb = () => {
  const context = useContext(MaintenanceDbCtx);
  if (!context) {
    throw new Error('useMaintenanceDb must be used within a MaintenanceDbCtx.Provider');
  }
  return context;
};

export const useKilometersDb = () => {
  const context = useContext(KilometersDbCtx);
  if (!context) {
    throw new Error('useKilometersDb must be used within a KilometersDbCtx.Provider');
  }
  return context;
};
```

### 3. Componenti Memoizzati
```tsx
// Componente per le Tab memoizzato per evitare re-render inutili
const TabBarComponent = React.memo(() => (
  <IonTabBar slot="bottom">
    {/* Tab content */}
  </IonTabBar>
));

// Componente per le Routes memoizzato
const RoutesComponent = React.memo(() => (
  <IonRouterOutlet>
    {/* Routes content */}
  </IonRouterOutlet>
));
```

### 4. useMemo per i Valori del Context
```tsx
function App() {
  // Usa useMemo per assicurarti che i valori del context non cambino ad ogni render
  const maintenanceDbValue = useMemo(() => maintenanceDbInstance, []);
  const kilometersDbValue = useMemo(() => kilometersDbInstance, []);

  return (
    <MaintenanceDbCtx.Provider value={maintenanceDbValue}>
      <KilometersDbCtx.Provider value={kilometersDbValue}>
        {/* App content */}
      </KilometersDbCtx.Provider>
    </MaintenanceDbCtx.Provider>
  );
}
```

## Benefici delle Ottimizzazioni

### Performance
- **Riduzione dei re-render**: I componenti non si ri-renderizzano inutilmente
- **Istanze singleton**: I servizi database vengono creati una sola volta
- **Memoizzazione**: Le Tab e Routes non si ri-renderizzano se non necessario

### Manutenibilità
- **Hook personalizzati**: Gestione centralizzata dell'accesso ai context
- **Error handling**: Controllo automatico della presenza del context
- **Separazione delle responsabilità**: Componenti più piccoli e focalizzati

### Debugging
- **React DevTools**: Migliore visibilità dei re-render con react-scan
- **Error boundaries**: Errori più chiari quando i context non sono disponibili

## File Aggiornati

### Componenti principali:
- `src/App.tsx` - Ottimizzazioni principali del context e memoizzazione
- `src/hooks/useDbContext.tsx` - Hook personalizzati per i context

### Pagine aggiornate:
- `src/pages/HomePage.tsx`
- `src/pages/ItemPage.tsx`
- `src/pages/KmPage.tsx`
- `src/pages/ListCarMaintenance.tsx`

### Componenti aggiornati:
- `src/components/LastKmFinded.tsx`
- `src/components/ListItem.tsx`
- `src/components/ExportItem.tsx`
- `src/components/ImportItem.tsx`
- `src/components/DeleteAllItems.tsx`

## Utilizzo

Ora invece di usare direttamente `useContext`, utilizza gli hook personalizzati:

```tsx
// PRIMA
const db = useContext(MaintenanceDbCtx);

// DOPO
const db = useMaintenanceDb();
```

Questo garantisce:
- Type safety migliore
- Error handling automatico
- Codice più pulito e leggibile
