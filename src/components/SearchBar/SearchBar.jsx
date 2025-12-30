// components/Header/SearchBar.js (Server Component wrapper)
import { Suspense } from 'react'
import SearchBarClient from './SearchBarClient'

export default function SearchBar() {
  return (
    <Suspense fallback={null}>
      <SearchBarClient />
    </Suspense>
  )
}
