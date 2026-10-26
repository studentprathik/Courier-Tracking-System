// =============================================================================
// Courier Tracking Web Application - Backend Server (app.js)
// Technology: Node.js with Express.js
// Description: Serves frontend static files and provides a REST API
//              to search sample courier data by Tracking ID.
// =============================================================================

// 1. IMPORT REQUIRED PACKAGES
// Express is a minimalist web framework for Node.js
const express = require('express');
// Path is a built-in Node.js module used to handle file and folder paths
const path = require('path');

// 2. INITIALIZE EXPRESS APP & DEFINE PORT
const app = express();
const PORT = 3000;

// 3. MIDDLEWARE SETUP
// Serve static frontend files (HTML, CSS, JavaScript) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming JSON payloads (useful for POST/PUT requests)
app.use(express.json());

// =============================================================================
// 4. SAMPLE COURIER RECORDS (IN-MEMORY JSON DATA)
// These records represent simulated packages with the four required statuses:
// - Booked
// - In Transit
// - Out for Delivery
// - Delivered
// =============================================================================
const courierRecords = [
  {
    trackingId: "TRK1001",
    sender: "Rahul Sharma (New Delhi)",
    receiver: "Priya Patel",
    destination: "Andheri West, Mumbai, Maharashtra - 400058",
    expectedDeliveryDate: "2026-10-30",
    status: "Booked"
  },
  {
    trackingId: "TRK1002",
    sender: "Amit Verma (Bengaluru)",
    receiver: "Sneha Reddy",
    destination: "Hitech City, Hyderabad, Telangana - 500081",
    expectedDeliveryDate: "2026-10-28",
    status: "In Transit"
  },
  {
    trackingId: "TRK1003",
    sender: "Ananya Sen (Kolkata)",
    receiver: "Vikram Malhotra",
    destination: "T. Nagar, Chennai, Tamil Nadu - 600017",
    expectedDeliveryDate: "2026-10-26",
    status: "Out for Delivery"
  },
  {
    trackingId: "TRK1004",
    sender: "Rohan Gupta (Pune)",
    receiver: "Neha Joshi",
    destination: "Malviya Nagar, Jaipur, Rajasthan - 302017",
    expectedDeliveryDate: "2026-10-24",
    status: "Delivered"
  }
];

// =============================================================================
// 5. API ROUTE: GET /api/courier/:trackingId
// Purpose: Looks up a courier record by its unique tracking ID.
//          Returns JSON with package details or an error message if not found.
// =============================================================================
app.get('/api/courier/:trackingId', (req, res) => {
  // Extract trackingId from URL route parameter and remove whitespace
  const requestedId = req.params.trackingId.trim();

  // Search case-insensitively in our sample JSON records
  const courier = courierRecords.find(
    (item) => item.trackingId.toUpperCase() === requestedId.toUpperCase()
  );

  // If courier record is found, send HTTP 200 (OK) with courier details
  if (courier) {
    return res.status(200).json({
      success: true,
      message: "Courier record found.",
      data: courier
    });
  }

  // If not found, send HTTP 404 (Not Found) with an error description
  return res.status(404).json({
    success: false,
    message: `Invalid Tracking ID "${requestedId}". Please check the ID and try again.`
  });
});

// =============================================================================
// 6. START THE HTTP SERVER
// Listens for incoming browser requests on port 3000
// =============================================================================
app.listen(PORT, () => {
  console.log("==================================================");
  console.log(` Courier Tracking Server is running!`);
  console.log(` Access application at: http://localhost:${PORT}`);
  console.log("==================================================");
});
