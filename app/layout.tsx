import { Inter } from "next/font/google";

import "./globals.css";
import ToasterContext from "./_context/ToasterContext";
import AuthContext from "./_context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Messenger Clone",
    description:
        "A Messenger web app clone the style and performance from some original resource.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthContext>
                    <ToasterContext />
                    {children}
                </AuthContext>
            </body>
        </html>
    );
}
