// app/search/page.js (Server Component)
import { Suspense } from 'react'
import SearchClient from '../SearchClient'

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchClient />
    </Suspense>
  )
}
