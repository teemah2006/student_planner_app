import "../globals.css";
import SessionProvider from "../components/SessionProvider";
import Navbar from "./components/navbar";
import { MobileNav } from "./components/navbar";
import AuthSync from "../components/authSync";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main
      className="flex flex-col md:flex-row"
    >

      <SessionProvider>
        <AuthSync />
        <Navbar /><Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: "#d1fae5",
                color: "#065f46",
                border: "1px solid #10b981",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              style: {
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #ef4444",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />{children}<MobileNav /></SessionProvider>
    </main>
  );
}