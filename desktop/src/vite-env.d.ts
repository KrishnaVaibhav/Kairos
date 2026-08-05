/// <reference types="vite/client" />

type MobileStatus = {
  phase: "idle" | "starting-tunnel" | "starting-expo" | "ready" | "error";
  backendUrl: string | null;
  expoUrl: string | null;
  error: string | null;
};

interface Window {
  desktop?: {
    getBackendUrl: () => Promise<string>;
    pickFolder: () => Promise<string | null>;
    app: {
      getPrefs: () => Promise<{ runInBackground: boolean; startOnStartup: boolean }>;
      setPrefs: (patch: { runInBackground?: boolean; startOnStartup?: boolean }) =>
        Promise<{ runInBackground: boolean; startOnStartup: boolean }>;
    };
    mobile: {
      start: () => Promise<MobileStatus>;
      stop: () => Promise<MobileStatus>;
      status: () => Promise<MobileStatus>;
      onStatus: (cb: (s: MobileStatus) => void) => () => void;
    };
  };
}
