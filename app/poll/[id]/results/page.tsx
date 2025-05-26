'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Poll } from '@/app/types'
import QRCode from 'qrcode'
import SmsShare from '@/app/components/SmsShare'

export default function PollResults() {
  const params = useParams()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${params.id}`)
        if (!response.ok) {
          throw new Error('Poll not found')
        }
        const data = await response.json()
        setPoll(data)

        // Generate QR code
        const pollUrl = `${window.location.origin}/join-poll?code=${data.shareCode}`
        const qrCode = await QRCode.toDataURL(pollUrl)
        setQrCodeUrl(qrCode)
      } catch (error) {
        setError('Failed to load poll results')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPoll()
  }, [params.id])

  if (isLoading) {
    return (
      <main className="min-h-screen p-4 max-w-4xl mx-auto flex items-center justify-center">
        <p className="text-text">Loading results...</p>
      </main>
    )
  }

  if (error || !poll) {
    return (
      <main className="min-h-screen p-4 max-w-4xl mx-auto flex items-center justify-center">
        <p className="text-red-500">{error || 'Poll not found'}</p>
      </main>
    )
  }

  // Calculate vote counts and rankings
  const voteCounts = poll.votes.reduce((acc, vote) => {
    const key = vote.location.placeId
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const rankings = Object.entries(voteCounts)
    .map(([placeId, count]) => {
      const location = poll.votes.find(v => v.location.placeId === placeId)?.location
      return { location, count }
    })
    .sort((a, b) => b.count - a.count)

  const pollUrl = `${window.location.origin}/join-poll?code=${poll.shareCode}`

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">{poll.title}</h1>
          {poll.description && (
            <p className="text-text mt-2">{poll.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Results</h2>
            <div className="space-y-4">
              {rankings.map(({ location, count }, index) => (
                <div key={location.placeId} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-text/60">{location.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{count}</p>
                      <p className="text-sm text-text/60">votes</p>
                    </div>
                  </div>
                  {index === 0 && count > 0 && (
                    <div className="mt-2 text-center">
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        🏆 Winner
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Share Poll</h2>
            <div className="card text-center">
              <p className="text-text mb-4">Share this poll with your friends</p>
              <div className="flex justify-center mb-4">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                )}
              </div>
              <p className="text-sm text-text/60 mb-4">
                Share Code: <span className="font-mono font-bold">{poll.shareCode}</span>
              </p>
              <div className="flex justify-center gap-4">
                <SmsShare pollUrl={pollUrl} pollTitle={poll.title} />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pollUrl)
                    alert('Link copied to clipboard!')
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 