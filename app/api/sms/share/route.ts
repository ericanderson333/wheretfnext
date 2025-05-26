import { NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Missing Twilio credentials')
}

const client = twilio(accountSid, authToken)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, pollUrl, pollTitle } = body

    if (!phoneNumber || !pollUrl || !pollTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const message = await client.messages.create({
      body: `Join my poll "${pollTitle}" to vote on where to go next! Click here: ${pollUrl}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })

    return NextResponse.json({ success: true, messageSid: message.sid })
  } catch (error) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
} 