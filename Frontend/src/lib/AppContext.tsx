
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { string } from "zod";

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
  mode: string;
  setmode :(theme: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  currentPDF: PDFFile;
  setCurrentPDF: (pdf: PDFFile) => void;
};

type mode = string;


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [mode, setmode] = useState<mode>("Chat");
  const [currentPDF, setCurrentPDF] = useState<PDFFile>(null);

  return (
    <AppContext.Provider value={{ mode,setmode,theme, setTheme, currentPDF, setCurrentPDF }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
};
