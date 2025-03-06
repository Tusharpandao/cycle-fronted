import { useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import PriceBreakdown from "../../component/price_breakdown/PriceBreakdown";

function CalculateForm() {
  const [formData, setFormData] = useState({
    brand: "",
    frame: "",
    handlebar: "",
    seating: "",
    wheel: "",
    breaks: "",
    tyre: "",
    chainAssembly: "",
    comments: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const breakdownRef = useRef(null);

  useEffect(() => {
    if (isSubmitted && breakdownRef.current) {
      breakdownRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isSubmitted]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //  Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    // Check for empty required fields (excluding "comments")
    const emptyFields = Object.keys(formData).filter(
      (key) => formData[key] === "" && key !== "comments"
    );

    // Show error alert if required fields are missing
    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please fill in these fields: ${emptyFields.join(", ")}`,
      });
      setIsSubmitted(false);
      return;
    }

    // If all required fields are filled, ask for confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to calculate the price?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, calculate",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (!result.isConfirmed) {
        return; // If the user cancels, stop execution
      }

      // If the user confirms, proceed with the calculation
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Your bike estimate calculation is on the way.",
      }).then(() => {
        setIsSubmitted(true);
      });
    });
  };

  const handleClear = () => {
    setFormData({
      brand: "",
      frame: "",
      handlebar: "",
      seating: "",
      wheel: "",
      breaks: "",
      tyre: "",
      chainAssembly: "",
      comments: "",
    });
    setIsSubmitted(false);
    console.log("Form cleared:", formData);
  };
  return (
    <>
      <div className="container py-1 mx-auto">
        <div className="form-container">
          <div className="form-header">
            <h2>Cycle Configuration</h2>
          </div>
          <form id="cycleForm">
            <div className="form-grid">
              {/* Brand */}
              <div className="form-group">
                <label htmlFor="brand">Brand:</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Brand
                  </option>
                  <option value="Avon">Avon</option>
                  <option value="Giant">Giant</option>
                  <option value="Hero">Hero</option>
                  <option value="Atlas">Atlas</option>
                  <option value="Schwinn">Schwinn</option>
                </select>
              </div>
              {/* Frame */}
              <div className="form-group">
                <label htmlFor="frame">Frame Material:</label>
                <select
                  id="frame"
                  name="frame"
                  value={formData.frame}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Frame Material
                  </option>
                  <option value="Steel">Steel ~ ₹200</option>
                  <option value="Aluminum">Aluminum ~ ₹300</option>
                  <option value="Carbon">Carbon Fiber ~ ₹800</option>
                </select>
              </div>
              {/* Handlebar */}
              <div className="form-group">
                <label htmlFor="handlebar">Handlebar Type:</label>
                <select
                  id="handlebar"
                  name="handlebar"
                  value={formData.handlebar}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Handlebar Type
                  </option>
                  <option value="Flat">Flat ~ ₹100</option>
                  <option value="Riser">Riser ~ ₹120</option>
                  <option value="Cruiser">Cruiser ~ ₹200</option>
                </select>
              </div>
              {/* Seating */}
              <div className="form-group">
                <label htmlFor="seating">Seating:</label>
                <select
                  id="seating"
                  name="seating"
                  value={formData.seating}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Seating
                  </option>
                  <option value="Upright">Upright ~ ₹100</option>
                  <option value="Aero">Aero ~ ₹150</option>
                  <option value="Climbing">Climbing ~ ₹200</option>
                </select>
              </div>
              {/* Wheel */}
              <div className="form-group">
                <label htmlFor="wheel">Wheel Type:</label>
                <select
                  id="wheel"
                  name="wheel"
                  value={formData.wheel}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Wheel Type
                  </option>
                  <option value="Spokes">Spokes Wheel ~ ₹150</option>
                  <option value="Rim">Rim Wheel ~ ₹200</option>
                </select>
              </div>
              {/* Tyres */}
              <div className="form-group">
                <label htmlFor="tyre">Tyres:</label>
                <select
                  id="tyre"
                  name="tyre"
                  value={formData.tyre}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Tyre Type
                  </option>
                  <option value="Tube">Tube Tyre ~ ₹100</option>
                  <option value="TubeLess">TubeLess Tyre ~ ₹200</option>
                </select>
              </div>
              {/* Brakes */}
              <div className="form-group">
                <label htmlFor="breaks">Breaks :</label>
                <select
                  id="breaks"
                  name="breaks"
                  value={formData.breaks}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Breaks
                  </option>
                  <option value="V-Brake">V-Brake ~ ₹250</option>
                  <option value="Disc">Disc ~ ₹350</option>
                  <option value="Cantilever">Cantilever ~ ₹400</option>
                </select>
              </div>
              {/* Chain Assembly */}
              <div className="form-group">
                <label htmlFor="chainAssembly">Chain Assembly:</label>
                <select
                  id="chainAssembly"
                  name="chainAssembly"
                  value={formData.chainAssembly}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Chain Assembly
                  </option>
                  <option value="4 Gears">4 Gears ~ ₹150</option>
                  <option value="6 Gears">6 Gears ~ ₹250</option>
                  <option value="8 Gears">8 Gears ~ ₹350</option>
                </select>
              </div>
            </div>
            {/* Comments   */}
            <div className="form-group full-width">
              <label htmlFor="comments">Comments:</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Write your comments here..."
                rows="4"
              ></textarea>
            </div>
            {/* Submit and Clear Buttons */}
            <button
              type="submit"
              className="submit-button"
              onClick={handleSubmit}
            >
              Calculate
            </button>
            <button
              type="button"
              className="clear-button "
              onClick={handleClear}
            >
              Clear
            </button>
          </form>
          {/* <div id="priceDisplay" className="price-display"></div> */}

          {isSubmitted && (
            <div ref={breakdownRef} className="mt-7 scroll-mt-[4.5rem]">
              {" "}
              <PriceBreakdown
                formData={formData}
                handleClear={handleClear}
              />{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CalculateForm;
