import { NextResponse } from 'next/server'
import { Client } from '@googlemaps/google-maps-services-js'

const client = new Client({})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await client.textSearch({
      params: {
        query,
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    })

    const locations = response.data.results.map((place) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      types: place.types,
      rating: place.rating,
      photos: place.photos?.map((photo) => photo.photo_reference),
    }))

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error searching locations:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
} 