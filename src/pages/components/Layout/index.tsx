// components/Layout.tsx

import Footer from './Footer'
import Navbar from './Navbar'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
        <Navbar/>
        <main className='h-screen'>{children}</main>
        <Footer />
    </>
  )
}
