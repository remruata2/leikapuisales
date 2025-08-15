import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Leikapui Studios - Movie Sales Dashboard",
	description:
		"Real-time insights into movie sales performance and analytics from Leikapui Studios",
	viewport:
		"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ProtectedRoute>{children}</ProtectedRoute>
			</body>
		</html>
	);
}
