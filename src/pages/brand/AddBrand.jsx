import React, { useState } from "react";
import axios from "axios";
import "./AddBrand.css";


const AddBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      alert("Brand name cannot be empty!");
      return;
    }

    setLoading(true);
  
    try {
      const headers = {
        'Authorization': 'Basic ' + btoa('admin:admin123'),
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `http://localhost:8081/api/brands/add/${brandName}`,
        null,
        { headers }
      );

      setResponseMessage("Brand added successfully!");
      console.log("Brand added:", response.data);
      setBrandName("");
    } catch (error) {
      console.error("Error adding brand:", error);
      setResponseMessage("Error adding brand: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-brand-container">
      <h2>Add New Brand</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Brand"}
        </button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddBrand;