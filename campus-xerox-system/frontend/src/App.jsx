import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import ShopDashboard from "./pages/ShopDashboard.jsx";

function App() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/shop" element={<ShopDashboard />} />
          <Route path="*" element={<p className="message error">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
