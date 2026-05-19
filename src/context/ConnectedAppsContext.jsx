import { createContext, useContext, useState } from "react";

const ConnectedAppsContext = createContext(null);

export function ConnectedAppsProvider({ children }) {
  const [connectedApps, setConnectedApps] = useState(new Set());

  function toggleApp(key) {
    setConnectedApps((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function isConnected(key) {
    return connectedApps.has(key);
  }

  return (
    <ConnectedAppsContext.Provider value={{ connectedApps, toggleApp, isConnected }}>
      {children}
    </ConnectedAppsContext.Provider>
  );
}

export function useConnectedApps() {
  return useContext(ConnectedAppsContext);
}
