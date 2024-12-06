const WebSocket = require('ws');

const initializeWebSocket = (wsServer) => {
    const clients = new Set();

    wsServer.on('connection', (ws) => {
        console.log('New client connected');
        clients.add(ws);

        // Handle incoming messages
        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            }
        });

        // Handle disconnection
        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws);
        });
    });

    console.log('WebSocket server initialized');
};

module.exports = { initializeWebSocket };