import { WebSocketServer } from "ws"

// Store active connections
const clients = new Map()

// Initialize WebSocket server
export const initWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on("connection", (ws, req) => {
    // Parse URL to get userId
    const parameters = new URL(req.url, "http://localhost")
    const userId = parameters.searchParams.get("userId")

    if (!userId) {
      console.log("WebSocket connection rejected: No user ID provided")
      ws.close()
      return
    }

    console.log(`WebSocket connection established for user: ${userId}`)

    // Store the connection with userId as key
    clients.set(userId, ws)

    // Handle client messages
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString())
        console.log(`Received message from user ${userId}:`, data)

        // Handle different message types if needed
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }
    })

    // Handle client disconnection
    ws.on("close", () => {
      console.log(`WebSocket connection closed for user: ${userId}`)
      clients.delete(userId)
    })

    // Send a welcome message
    ws.send(
      JSON.stringify({
        type: "connection",
        message: "Connected to notification service",
        timestamp: new Date().toISOString(),
      }),
    )
  })

  return wss
}

// Function to send notification to a specific user
export const sendNotificationToUser = (userId, notification) => {
  const client = clients.get(userId)

  if (client && client.readyState === WebSocket.OPEN) {
    console.log(`Sending notification to user ${userId}:`, notification.title)

    client.send(
      JSON.stringify({
        type: "notification",
        notification,
        timestamp: new Date().toISOString(),
      }),
    )

    return true
  } else {
    console.log(`User ${userId} is not connected, notification not sent in real-time`)
    return false
  }
}

// Function to broadcast notification to all connected users
export const broadcastNotification = (notification) => {
  console.log(`Broadcasting notification to all users: ${notification.title}`)

  let sentCount = 0

  clients.forEach((client, userId) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "notification",
          notification,
          timestamp: new Date().toISOString(),
        }),
      )
      sentCount++
    }
  })

  return sentCount
}