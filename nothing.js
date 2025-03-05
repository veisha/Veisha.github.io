const express = require('express'); // Import Express
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

// Initialize the Express app
const app = express();

// Create the HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/esp' }); // WebSocket on /esp path

// File paths for the data storage
const CLIENT_DATA_FILE = 'clientData.json';
const SOS_MESSAGES_FILE = 'sosMessages.json';

// Function to initialize a file if it doesn't exist
function initializeFile(filePath, initialData) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
}

// Initialize clientData.json and sosMessages.json
initializeFile(CLIENT_DATA_FILE, []);
initializeFile(SOS_MESSAGES_FILE, []);

// Function to read data from a file
function readData(filePath) {
  try {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Function to write data to a file
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));  // This will serve index.html and other assets from 'public'

// Handle the root route (serving the index.html file)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html from 'public' folder
});


// **New route to get all client data**
app.get('/api/clients', (req, res) => {
  const clientData = readData(CLIENT_DATA_FILE);
  res.json(clientData);
});


// New route to get all SOS messages
app.get('/api/sos-messages', (req, res) => {
  const sosMessages = readData(SOS_MESSAGES_FILE);
  res.json(sosMessages);
});


// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A new WebSocket client connected');

  ws.on('message', (data) => {
    console.log('Data received from ESP:', data);
    const receivedData = JSON.parse(data);

    if (receivedData.type === 1) {
        // Handle ClientData
        const { requestID, name, password, ssid } = receivedData;
        const clientData = readData(CLIENT_DATA_FILE);

        // Generate a unique 5-digit UUID
        let uniqueId;
        do {
          uniqueId = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
        } while (clientData.some((client) => client.uniqueId === uniqueId)); // Ensure it's unique
        console.log("Unique ID generated: " + uniqueId);
        // Check if the client data (name and password) already exists
        const existingClient = clientData.find(
          (client) => client.name === name && client.password === password
        );

        if (!existingClient) {
          // Save the new client data if it doesn't already exist
          clientData.push({ uniqueId, name, password, ssid });
          console.log('New ClientData saved:', { uniqueId, name, password, ssid });
          writeData(CLIENT_DATA_FILE, clientData); // Write updated ClientData to file

          // Prepare the response message
          let responseMessage = {
            type: 8,       // Type 8 for client registration success
            uniqueId,      // Include the generated unique ID
            requestID,     // Include the original RequestID
            name,          // Include the name
            ssid           // Include the ssid
          };

          // Send the response back to the main hub (or slave device)
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(responseMessage)); // Send back UUID registration result
            }
          });
        } else {
          console.log('Duplicate ClientData received, not saving.');
        }
    } 
    else if (receivedData.type === 2) {
      // Handle SOS message
      const { senderUUID, message, location, ssid } = receivedData;
      
      // Read client data to get the name associated with the UUID
      const clientData = readData(CLIENT_DATA_FILE);
      
      // Find the client with the matching UUID
      const client = clientData.find((client) => client.uniqueId === senderUUID);
      
      // Use the name if the client is found, otherwise default to the UUID
      const senderName = client ? client.name : senderUUID;
      
      // Add the new SOS message with a timestamp
      const sosMessages = readData(SOS_MESSAGES_FILE);
      const newMessage = { 
        type: 2,       // Add the type field for SOS message
        senderName,    // Use the name instead of UUID
        senderUUID, 
        message, 
        location, 
        ssid, 
        timestamp: new Date().toISOString() 
      };
      
      sosMessages.push(newMessage);
      console.log(`SOS from ${senderName}: ${message} (Location: ${location}, SSID: ${ssid})`);
      
      // Write updated SOS messages to file
      writeData(SOS_MESSAGES_FILE, sosMessages); 
    
      // Broadcast the updated message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          console.log("[SERVER - FRONT END] Sending SOS message to client");
          client.send(JSON.stringify(newMessage)); 
        }
      });
    }
    else if (receivedData.type === 3) {
      // Handle UUID Verification
      const { uuid } = receivedData;
    
      // Read the client data from the file
      const clientData = readData(CLIENT_DATA_FILE);
    
      // Check if the UUID exists in the client data
      const existingClient = clientData.find((client) => client.uniqueId === uuid);
    
      let responseMessage = { type: 4 };  // Type 4 for UUID verification response
    
      if (existingClient) {
        // UUID exists, send valid response (1)
        responseMessage.uuid = uuid;
        responseMessage.isValid = 1;  // Valid UUID
        console.log(`[UUID Verification] UUID ${uuid} is valid.`);
      } else {
        // UUID does not exist, send invalid response (0)
        responseMessage.uuid = uuid;
        responseMessage.isValid = 0;  // Invalid UUID
        console.log(`[UUID Verification] UUID ${uuid} is invalid.`);
      }
    
      // Send the response back to the main hub (or slave device)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(responseMessage));  // Send back UUID verification result
        }
      });
    }
    else if (receivedData.type === 7) {
      // Handle Name and Password Verification
      const { name, password, SignInRequestID } = receivedData;
    
      // Convert password to string in case it is received as an integer
      const passwordString = String(password);
    
      // Read the client data from the file
      const clientData = readData(CLIENT_DATA_FILE);
    
      // Log received data for debugging
      console.log("Received Name:", name);
      console.log("Received Password (as string):", passwordString);
      console.log("Stored Client Data:", clientData);
    
      // Check if the name and password exist in the client data
      const existingClient = clientData.find(
        (client) =>
          client.name.trim() === name.trim() &&
          client.password.trim() === passwordString.trim()
      );
    
      // Prepare the response message
      let responseMessage = { type: 6, SignInRequestID }; // Include SignInRequestID in the response
    
      if (existingClient) {
        // Name and password exist, include the UUID in the response
        responseMessage.uuid = existingClient.uniqueId;
        responseMessage.isValid = 1; // Valid credentials
        console.log(
          `[Name and Password Verification] Credentials for name "${name}" are valid. UUID: ${existingClient.uniqueId}`
        );
      } else {
        // Name and password do not exist, send invalid response
        responseMessage.isValid = 0; // Invalid credentials
        console.log(
          `[Name and Password Verification] Invalid credentials for name "${name}".`
        );
      }
    
      // Send the response back to the main hub (or slave device)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(responseMessage)); // Send back verification result
        }
      });
    }
    
    
    
    else {
      console.log('Unknown message type received.');
    }

    // Send updates to all clients (broadcast) // why is it when i have this it works?
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify(receivedData));
    //   }
    // });


  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Start the server on a specific address and port
server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:3000/');
});

 