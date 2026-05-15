import { useState } from 'react'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import type { Event } from '../types/event.types'

export function useEventFilters(events: Event[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const debouncedSearch = useDebounce(search, 500)

  const filtered = events?.filter(event => {
    const matchSearch =
      event.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      event.location.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchStatus = statusFilter === 'all' || event.status === statusFilter
    return matchSearch && matchStatus
  })

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filtered,
  }
}