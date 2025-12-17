// client/src/app/layout.js (FIXED)

import '../app/global.css'; // <-- ADDED: Imports the global styles, including Tailwind directives.

export const metadata = {
  title: 'Manpower MS | Client',
  description: 'Manpower Management System Frontend Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}