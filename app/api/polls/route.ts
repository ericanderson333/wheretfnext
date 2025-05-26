import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import { Poll } from '@/app/models/Poll'

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { title, description, locations } = body

    // Generate a temporary hostId (in a real app, this would come from authentication)
    const hostId = Math.random().toString(36).substring(7)

    const poll = await Poll.create({
      title,
      description,
      hostId,
      votes: locations.map((location: any) => ({
        location,
        voterId: hostId,
      })),
    })

    return NextResponse.json(poll)
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const shareCode = searchParams.get('shareCode')

    if (shareCode) {
      const poll = await Poll.findOne({ shareCode })
      if (!poll) {
        return NextResponse.json(
          { error: 'Poll not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(poll)
    }

    const polls = await Poll.find().sort({ createdAt: -1 })
    return NextResponse.json(polls)
  } catch (error) {
    console.error('Error fetching polls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
} 