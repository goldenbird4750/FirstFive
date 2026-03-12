import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "First Five",
  description: "Convert resistance into action",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <div className="bg-[#0f172a] text-white antialiased" >

        <div className="min-h-screen flex flex-col">
          {/* Top Navigation */}
          <header className=" bg-[#0f172a]  border-b border-gray-700 ">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
                  
              {/* Logo */}
              <h1 className="text-xl font-semibold tracking-wide">
                First Five
              </h1>
                      
              {/* Navigation */}
              <nav className="flex items-center gap-6 text-lg text-gray-300 " >
                <Link href="/" className="hover:text-white transition">
                  Foundation
                </Link>
                <Link href="/mindset" className="hover:text-white transition">
                 Mindset
                </Link>
                <Link href="/battle" className="hover:text-white transition">
                  Action
                </Link>
                <Link href="/profile" className="hover:text-white transition">
                  Profile
                </Link>
              </nav>

            </div>
          </header>
       


          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-3xl mx-auto px-6 py-16">
              {children}
            </div>
          </main>

      
        </div>
        </div>
      </body>
    </html>
  );
}