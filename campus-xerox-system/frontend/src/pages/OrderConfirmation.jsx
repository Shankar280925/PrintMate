import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/api.js";
import OrderDetails from "../components/OrderDetails.jsx";

function OrderConfirmation() {
  const { orderId } = useParams(); // reads :orderId from the URL
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Runs once when the page opens
  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return <p className="message">Loading your order...</p>;
  }
  if (errorMessage) {
    return <p className="message error">{errorMessage}</p>;
  }

  return (
    <div>
      <p className="message success">Order placed successfully! Save your Order ID: {order.orderId}</p>
      <h1>Order Confirmation</h1>
      <OrderDetails order={order} />
      <p>
        <Link to="/track" className="button">Track Order</Link>{" "}
        <Link to="/place-order" className="button secondary">Place Another Order</Link>
      </p>
    </div>
  );
}

export default OrderConfirmation;
