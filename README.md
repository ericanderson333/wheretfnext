# WhereTFNext

A modern web application for planning your next destination after a party or gathering. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Create polls for deciding the next destination
- Share polls via text message or QR code
- Search for locations using Google Places API
- Real-time poll results and rankings
- Modern, responsive design inspired by Partiful

## Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Google Maps API key
- Twilio account (for SMS functionality)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB
- Google Places API
- Twilio
- QR Code generation

## Contributing

Feel free to submit issues and enhancement requests! 