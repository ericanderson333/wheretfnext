'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Location } from '../types'

export default function CreatePoll() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/locations/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Error searching locations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (location: Location) => {
    if (!selectedLocations.find(loc => loc.placeId === location.placeId)) {
      setSelectedLocations([...selectedLocations, location])
    }
    setSearchQuery('')
    setSearchResults([])
  }

  const handleLocationRemove = (placeId: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.placeId !== placeId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || selectedLocations.length === 0) return

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          locations: selectedLocations,
        }),
      })

      const data = await response.json()
      router.push(`/poll/${data.id}`)
    } catch (error) {
      console.error('Error creating poll:', error)
    }
  }

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Create a Poll</h1>
          <p className="text-text mt-2">Let's find the perfect next destination!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-text font-medium">Poll Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Where should we go after the party?"
                required
              />
            </label>

            <label className="block">
              <span className="text-text font-medium">Description (Optional)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Add any additional details..."
                rows={3}
              />
            </label>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Search for a location..."
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((location) => (
                  <div
                    key={location.placeId}
                    className="card cursor-pointer hover:bg-gray-50"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-text/60">{location.address}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedLocations.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Selected Locations</h3>
                <div className="space-y-2">
                  {selectedLocations.map((location) => (
                    <div key={location.placeId} className="card flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-sm text-text/60">{location.address}</p>
                      </div>
                      <button
                        onClick={() => handleLocationRemove(location.placeId)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={!title.trim() || selectedLocations.length === 0}
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 