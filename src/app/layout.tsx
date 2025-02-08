"use client";
import { Provider } from "react-redux";
import Sidebar from "./components/sidebar";
import TopNav from "./components/top_nav";
import "./globals.css";
import { store } from "./reduxStore/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className="flex">
          <Sidebar />
          <section className="w-[80%] bg-gray/10 fixed overflow-y-auto right-0 h-[100vh]">
            <div className="h-[5rem]">
              <TopNav />
            </div>
            <div className="px-8">{children}</div>
          </section>
        </body>
      </html>
    </Provider>
  );
}
