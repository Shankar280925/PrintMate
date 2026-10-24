import StatusBadge from "./StatusBadge.jsx";

function OrderDetails({ order }) {
  return (
    <div className="card">
      <table className="details-table">
        <tbody>
          <tr>
            <th>Order ID</th>
            <td><strong>{order.orderId}</strong></td>
          </tr>
          <tr>
            <th>Student Name</th>
            <td>{order.studentName}</td>
          </tr>
          <tr>
            <th>Document</th>
            <td>{order.documentName}</td>
          </tr>
          <tr>
            <th>Pages</th>
            <td>{order.pages}</td>
          </tr>
          <tr>
            <th>Copies</th>
            <td>{order.copies}</td>
          </tr>
          <tr>
            <th>Print Type</th>
            <td>{order.printType}</td>
          </tr>
          <tr>
            <th>Printing Side</th>
            <td>{order.printSide}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>₹{order.amount}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td><StatusBadge status={order.status} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
