import Sidebar from "./components/sidebar";
import TopNav from "./components/top_nav";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <section className="w-[80%] bg-gray/10 fixed right-0 h-[100vh]">
          <TopNav />
          {children}
        </section>
      </body>
    </html>
  );
}
