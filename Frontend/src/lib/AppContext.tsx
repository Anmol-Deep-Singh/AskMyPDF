// AppContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Define your PDF type
type PDFFile = {
  _id: string;
  filename: string;
  path: string;
  size: number;
  user: string;
  uploadedAt: string;
  __v: number;
} | null;

type AppContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  currentPDF: PDFFile;
  setCurrentPDF: (pdf: PDFFile) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [currentPDF, setCurrentPDF] = useState<PDFFile>(null);

  return (
    <AppContext.Provider value={{ theme, setTheme, currentPDF, setCurrentPDF }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
};
