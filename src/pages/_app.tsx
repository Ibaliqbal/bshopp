import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import AppShell from "@/components/layouts/AppShell";
import Head from "next/head";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@smastrom/react-rating/style.css";
import { FavoriteProvider } from "@/context/favorite/favorite.context";
import { CartProvider } from "@/context/cart/cart.context";
import { UserProvider } from "@/context/user/user.context";
import { OrderProvider } from "@/context/order/order.context";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <FavoriteProvider>
            <CartProvider>
              <OrderProvider>
                <AppShell>
                  <Component {...pageProps} />
                  <Toaster position="top-center" richColors duration={2000} />
                </AppShell>
              </OrderProvider>
            </CartProvider>
          </FavoriteProvider>
        </UserProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
