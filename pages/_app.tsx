import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/common/Navbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Navbar />
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
