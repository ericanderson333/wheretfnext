'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Poll, Location } from '../types'

export default function JoinPoll() {
  const router = useRouter()
  const [shareCode, setShareCode] = useState('')
  const [poll, setPoll] = useState<Poll | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shareCode.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/polls?shareCode=${shareCode}`)
      if (!response.ok) {
        throw new Error('Poll not found')
      }
      const data = await response.json()
      setPoll(data)
    } catch (error) {
      setError('Invalid share code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (location: Location) => {
    if (!poll) return

    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          voterId: Math.random().toString(36).substring(7), // Temporary voter ID
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }

      router.push(`/poll/${poll.id}/results`)
    } catch (error) {
      setError('Failed to submit vote. Please try again.')
    }
  }

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Join a Poll</h1>
          <p className="text-text mt-2">Enter the share code to vote</p>
        </div>

        {!poll ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <label htmlFor="shareCode" className="block text-text font-medium mb-2">
                Share Code
              </label>
              <input
                id="shareCode"
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Enter 6-character code"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Join Poll'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary">{poll.title}</h2>
              {poll.description && (
                <p className="text-text mt-2">{poll.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {poll.votes.map((vote) => (
                <div
                  key={vote.location.placeId}
                  className="card cursor-pointer hover:bg-gray-50"
                  onClick={() => handleVote(vote.location)}
                >
                  <h3 className="font-medium">{vote.location.name}</h3>
                  <p className="text-sm text-text/60">{vote.location.address}</p>
                  {vote.location.rating && (
                    <div className="mt-2 flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{vote.location.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 