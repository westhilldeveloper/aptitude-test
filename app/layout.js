import './globals.css';

export const metadata = {
  title: 'Employee Aptitude Test',
  description: 'Knowledge testing platform for employees',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}