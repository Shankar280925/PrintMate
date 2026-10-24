import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Skip the Xerox Queue</h1>
        <p>
          Submit your print request before the break, and collect it when it is ready.
          No more waiting in long lines during short breaks.
        </p>
        <Link to="/place-order" className="button">Place an Order</Link>
      </section>

      <h2>How it works</h2>
      <div className="steps-grid">
        <div className="card">
          <h3>1. Submit</h3>
          <p>Upload your document and choose copies, colour and side.</p>
        </div>
        <div className="card">
          <h3>2. Track</h3>
          <p>Use your Order ID to see if it is Pending, Processing or Ready.</p>
        </div>
        <div className="card">
          <h3>3. Collect</h3>
          <p>When it is Ready, go to the shop, pay and collect it.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
