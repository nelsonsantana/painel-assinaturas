// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Controle de Assinaturas',
  description: 'Painel de vencimentos de clientes',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
