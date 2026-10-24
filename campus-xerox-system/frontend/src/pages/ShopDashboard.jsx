import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, getFileUrl } from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

const ALL_STATUSES = ["PENDING", "PROCESSING", "READY", "COLLECTED", "CANCELLED"];

// What the "next step" button moves each status to
const NEXT_STATUS = {
  PENDING: "PROCESSING",
  PROCESSING: "READY",
  READY: "COLLECTED",
};

function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  async function loadOrders() {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  }

  // Load orders once when the page opens
  useEffect(() => {
    loadOrders();
  }, []);

  async function changeStatus(orderId, newStatus) {
    setErrorMessage("");
    setSuccessMessage("");
    setUpdatingOrderId(orderId);

    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);

      // Replace the old order in the list with the updated one
      const newList = orders.map((order) => {
        if (order.orderId === updatedOrder.orderId) {
          return updatedOrder;
        }
        return order;
      });
      setOrders(newList);
      setSuccessMessage("Order " + orderId + " is now " + newStatus + ".");
    } catch (error) {
      setErrorMessage(error.message);
    }

    setUpdatingOrderId("");
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Shop Dashboard</h1>
        <button className="button secondary" onClick={loadOrders} disabled={loading}>
          Refresh
        </button>
      </div>

      {errorMessage && <p className="message error">{errorMessage}</p>}
      {successMessage && <p className="message success">{successMessage}</p>}
      {loading && <p className="message">Loading orders...</p>}

      {!loading && orders.length === 0 && !errorMessage && (
        <p className="message">No orders yet.</p>
      )}

      {orders.length > 0 && (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student</th>
                <th>Register No.</th>
                <th>Document</th>
                <th>Pages</th>
                <th>Copies</th>
                <th>Type</th>
                <th>Side</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td><strong>{order.orderId}</strong></td>
                  <td>{order.studentName}</td>
                  <td>{order.registerNumber}</td>
                  <td>
                    <a href={getFileUrl(order.documentPath)} target="_blank" rel="noreferrer">
                      {order.documentName}
                    </a>
                  </td>
                  <td>{order.pages}</td>
                  <td>{order.copies}</td>
                  <td>{order.printType}</td>
                  <td>{order.printSide}</td>
                  <td>₹{order.amount}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <select
                      value={order.status}
                      disabled={updatingOrderId === order.orderId}
                      onChange={(e) => changeStatus(order.orderId, e.target.value)}
                    >
                      {ALL_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    {NEXT_STATUS[order.status] && (
                      <button
                        className="button small"
                        disabled={updatingOrderId === order.orderId}
                        onClick={() => changeStatus(order.orderId, NEXT_STATUS[order.status])}
                      >
                        Mark {NEXT_STATUS[order.status]}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShopDashboard;
