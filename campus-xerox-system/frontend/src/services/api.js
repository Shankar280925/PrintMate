// Backend address. Must match the backend PORT in .env
const SERVER_URL = "http://localhost:5000";
const API_URL = SERVER_URL + "/api";

// Sends the request and converts failures into readable error messages
async function sendRequest(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    // fetch fails like this only when the server cannot be reached
    throw new Error("Cannot connect to the server. Please make sure the backend is running.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    // Use the message sent by the backend if there is one
    const message = data && data.message ? data.message : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

// POST /api/orders  (formData contains text fields + the file)
export function createOrder(formData) {
  // Do NOT set Content-Type here. The browser sets it correctly for FormData.
  return sendRequest(API_URL + "/orders", {
    method: "POST",
    body: formData,
  });
}

// GET /api/orders
export function getAllOrders() {
  return sendRequest(API_URL + "/orders");
}

// GET /api/orders/:orderId
export function getOrderById(orderId) {
  return sendRequest(API_URL + "/orders/" + encodeURIComponent(orderId));
}

// PUT /api/orders/:orderId/status
export function updateOrderStatus(orderId, status) {
  return sendRequest(API_URL + "/orders/" + encodeURIComponent(orderId) + "/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: status }),
  });
}

// Full link to an uploaded file, e.g. http://localhost:5000/uploads/123.pdf
export function getFileUrl(documentPath) {
  return SERVER_URL + "/" + documentPath;
}
