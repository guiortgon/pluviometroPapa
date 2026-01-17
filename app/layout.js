import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
    title: "Pluviómetro",
    description: "Gestión de registros de lluvia",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className={`${outfit.className} antialiased min-h-screen bg-sky-50 text-slate-100 selection:bg-cyan-500 selection:text-white`}>
                {children}
            </body>
        </html>
    );
}
