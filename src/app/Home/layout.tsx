import "../globals.css";
import SessionProvider from "../components/SessionProvider";
import Navbar from "./components/navbar";
import { MobileNav } from "./components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <main
        className= "flex flex-col md:flex-row"
      >
        
        <SessionProvider><Navbar/>{children}<MobileNav/></SessionProvider>
      </main>
  );
}