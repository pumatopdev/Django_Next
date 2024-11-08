"use client"; // Ensure this is a client component to use AuthProvider

import { AuthProvider } from '../context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
      </ProductProvider>
    </AuthProvider>
  );
}