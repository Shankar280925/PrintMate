import { useState } from "react";
import { getOrderById } from "../services/api.js";
import OrderDetails from "../components/OrderDetails.jsx";

// The normal order of statuses
const STEPS = ["PENDING", "PROCESSING", "READY", "COLLECTED"];

function TrackOrder() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setErrorMessage("");
    setOrder(null);

    if (orderIdInput.trim() === "") {
      setErrorMessage("Please enter an Order ID.");
      return;
    }

    setLoading(true);
    try {
      const data = await getOrderById(orderIdInput.trim());
      setOrder(data);
    } catch (error) {
      setErrorMessage(error.message); // "Order not found." comes from the backend
    }
    setLoading(false);
  }

  // Decides the CSS class of each step in the progress bar
  function getStepClass(stepIndex, currentIndex) {
    if (stepIndex < currentIndex) return "step done";
    if (stepIndex === currentIndex) return "step current";
    return "step";
  }

  const currentIndex = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div>
      <h1>Track Order</h1>

      <form className="card form" onSubmit={handleSearch}>
        <label>Order ID</label>
        <input
          type="text"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
          placeholder="Example: XR1001"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {errorMessage && <p className="message error">{errorMessage}</p>}

      {order && (
        <div>
          <h2>Progress</h2>
          {order.status === "CANCELLED" ? (
            <p className="message error">This order was cancelled.</p>
          ) : (
            <div className="progress">
              {STEPS.map((step, index) => (
                <div key={step} className={getStepClass(index, currentIndex)}>
                  <div className="circle">{index + 1}</div>
                  <div className="step-label">{step}</div>
                </div>
              ))}
            </div>
          )}

          <OrderDetails order={order} />
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
