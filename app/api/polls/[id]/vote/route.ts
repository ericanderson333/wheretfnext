import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import { Poll } from '@/app/models/Poll'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await request.json()
    const { location, voterId } = body

    const poll = await Poll.findById(params.id)
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    if (poll.status === 'closed') {
      return NextResponse.json(
        { error: 'This poll is closed' },
        { status: 400 }
      )
    }

    // Remove any existing vote from this voter
    poll.votes = poll.votes.filter((vote) => vote.voterId !== voterId)

    // Add the new vote
    poll.votes.push({
      location,
      voterId,
      timestamp: new Date(),
    })

    await poll.save()

    return NextResponse.json(poll)
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
} 