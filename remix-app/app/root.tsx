import { Links, Meta, Scripts, Outlet } from '@remix-run/react'
import './tailwind.css'

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="p-6">
          <Outlet />
        </main>
        <Scripts />
      </body>
    </html>
  )
}
