import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
export const metadata = {
  title: "5Min-Shift",
  description: "Convert resistance into action",
  icons:{
    icon:"/favicon2.ico"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
      <body >
        <div className="bg-[#0f172a] text-white antialiased" >

        <div className="min-h-screen flex flex-col">
          {/* Top Navigation */}
          <header className=" bg-[#0f172a]  border-b border-gray-700 ">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
                  
              {/* Logo */}
              <div className="text-2xl">
          <span className="text-indigo-400 font-bold">5Min</span>Shift 
        </div>
                      
              {/* Navigation */}
              <nav className="flex items-center gap-6 text-lg text-gray-300 " >
                {/* <Link href="/" className="hover:text-white transition">
                  Foundation
                </Link>
                <Link href="/mindset" className="hover:text-white transition">
                 Mindset
                </Link> */}
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
      </Providers>
    </html>
  );
}