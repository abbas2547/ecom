import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const client = await connectToDatabase()
    const db = client.db('zyrox')
    const ordersCollection = db.collection('orders')

    // Create order
    const order = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await ordersCollection.insertOne(order)

    return NextResponse.json(
      {
        success: true,
        _id: result.insertedId,
        ...order,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
