import "../globals.css";
import SessionProvider from "../../components/Features/SessionProvider";
import Navbar from "../../components/Common/navbar";
import { MobileNav } from "../../components/Common/navbar";
// import AuthSync from "../components/authSync";

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
        {/* <AuthSync /> */}
        <Navbar />{children}<MobileNav /></SessionProvider>
    </main>
  );
}