import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";
import { Auth } from "@arcana/auth-react";
import { AuthProvider } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";

const provider = new AuthProvider(
  "xar_test_51a4a827670c88144dcc740b31b7f62afbb3e7dd"
);

provider.init().then(() => {
  console.log("Auth Provider initialized");
});

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Scaffold Lite</title>
      </Head>
      <ProvideAuth provider={provider}>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
            <Footer />
          </ContentContainer>
        </div>
      </ProvideAuth>
    </>
  );
};

export default App;
