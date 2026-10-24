import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function PlaceOrder() {
  const navigate = useNavigate();

  // Each useState holds the current value of one form field
  const [studentName, setStudentName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("1");
  const [copies, setCopies] = useState("1");
  const [printType, setPrintType] = useState("Black & White");
  const [printSide, setPrintSide] = useState("Single Side");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Runs when the student picks a file
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    setErrorMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setErrorMessage("Invalid file type. Only PDF, JPG, JPEG and PNG files are allowed.");
      setFile(null);
      event.target.value = "";
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage("File is too large. Maximum size is 5 MB.");
      setFile(null);
      event.target.value = "";
      return;
    }
    setFile(selectedFile);
  }

  // Runs when the student clicks "Place Xerox Order"
  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setErrorMessage("");

    // Quick checks for a faster response. The backend checks again.
    if (studentName.trim() === "") {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (registerNumber.trim() === "") {
      setErrorMessage("Please enter your register number.");
      return;
    }
    if (!file) {
      setErrorMessage("Please upload a document.");
      return;
    }
    if (Number(pages) < 1 || Number(copies) < 1) {
      setErrorMessage("Pages and copies must be at least 1.");
      return;
    }

    // FormData carries both text fields and the file
    const formData = new FormData();
    formData.append("studentName", studentName.trim());
    formData.append("registerNumber", registerNumber.trim());
    formData.append("pages", pages);
    formData.append("copies", copies);
    formData.append("printType", printType);
    formData.append("printSide", printSide);
    formData.append("document", file); // name "document" matches upload.single("document")

    setLoading(true);
    try {
      const createdOrder = await createOrder(formData);
      navigate("/confirmation/" + createdOrder.orderId);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Place Xerox Order</h1>
      <p className="hint">Rates: Black &amp; White ₹1 per page, Color ₹5 per page. The final amount is calculated by the shop server.</p>

      <form className="card form" onSubmit={handleSubmit}>
        {errorMessage && <p className="message error">{errorMessage}</p>}

        <label>Student Name</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Register Number</label>
        <input
          type="text"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          placeholder="Enter your register number"
        />

        <label>Upload Document (PDF, JPG, JPEG, PNG - max 5 MB)</label>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />

        <div className="form-row">
          <div>
            <label>Number of Pages (in your document)</label>
            <input
              type="number"
              min="1"
              max="500"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
          </div>
          <div>
            <label>Number of Copies</label>
            <input
              type="number"
              min="1"
              max="100"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Print Type</label>
            <select value={printType} onChange={(e) => setPrintType(e.target.value)}>
              <option value="Black & White">Black &amp; White</option>
              <option value="Color">Color</option>
            </select>
          </div>
          <div>
            <label>Printing Side</label>
            <select value={printSide} onChange={(e) => setPrintSide(e.target.value)}>
              <option value="Single Side">Single Side</option>
              <option value="Double Side">Double Side</option>
            </select>
          </div>
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Placing order..." : "Place Xerox Order"}
        </button>
      </form>
    </div>
  );
}

export default PlaceOrder;
