import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export const dynamic = 'force-dynamic';

interface Client {
  controller: ReadableStreamDefaultController<Uint8Array>;
  active: boolean;
}

let clients = new Map<string, Client>();
let interval: NodeJS.Timeout | null = null;

async function fetchBeds() {
  try {
    const client = await clientPromise;
    const db = client.db('hospital-bed');
    return await db.collection('beds').find({}).toArray();
  } catch (error) {
    console.error('Error fetching beds:', error);
    return null;
  }
}

async function broadcastBeds() {
  const beds = await fetchBeds();
  if (beds) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`data: ${JSON.stringify(beds)}\n\n`);
    
    // Remove inactive clients and send data to active ones
    for (const [id, client] of clients.entries()) {
      try {
        if (!client.active) {
          clients.delete(id);
          continue;
        }
        client.controller.enqueue(data);
      } catch (error) {
        console.error('Error sending data to client:', error);
        client.active = false;
        clients.delete(id);
      }
    }

    // Clear interval if no clients are connected
    if (clients.size === 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  }
}

export async function GET() {
  const encoder = new TextEncoder();
  const clientId = Math.random().toString(36).substring(7);

  const stream = new ReadableStream({
    start(controller) {
      clients.set(clientId, { controller, active: true });
      
      // Send initial data
      fetchBeds().then(beds => {
        if (beds) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(beds)}\n\n`));
          } catch (error) {
            console.error('Error sending initial data:', error);
          }
        }
      });

      // Start polling if not already started
      if (!interval) {
        interval = setInterval(broadcastBeds, 5000); // Poll every 5 seconds
      }
    },
    cancel() {
      const client = clients.get(clientId);
      if (client) {
        client.active = false;
        clients.delete(clientId);
      }

      // Clear interval if no clients are connected
      if (clients.size === 0 && interval) {
        clearInterval(interval);
        interval = null;
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 