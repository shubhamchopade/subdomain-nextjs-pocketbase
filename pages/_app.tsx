import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Navbar />
      <ToastContainer />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
}
