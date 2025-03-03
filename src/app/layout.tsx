"use client";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import TopNav from "./components/top_nav";
import "./globals.css";
import { store } from "./reduxStore/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPreviewPage = pathname === "/preview";

  return (
    <Provider store={store}>
      <html lang="en">
        <body className="flex">
          {!isPreviewPage && <Sidebar />}
          <section
            className={`${
              isPreviewPage ? "w-full h-auto" : "w-[80%] fixed right-0 h-[100vh]"
            } bg-gray/10 overflow-y-auto`}
          >
            {!isPreviewPage && (
              <div className="h-[5rem]">
                <TopNav />
              </div>
            )}
            <div className={isPreviewPage ? "" : "px-8"}>{children}</div>
          </section>
        </body>
      </html>
    </Provider>
  );
}
