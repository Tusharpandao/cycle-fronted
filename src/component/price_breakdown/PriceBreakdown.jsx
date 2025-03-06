import PropTypes from "prop-types";
import { useEstimate } from "../../hooks/useEstimate";
import Swal from "sweetalert2";

function PriceBreakdown({ formData, handleClear }) {
  PriceBreakdown.propTypes = {
    formData: PropTypes.shape({
      brand: PropTypes.string,
      frame: PropTypes.string,
      handlebar: PropTypes.string,
      seating: PropTypes.string,
      wheel: PropTypes.string,
      tyre: PropTypes.string,
      chainAssembly: PropTypes.string,
      breaks: PropTypes.string,
    }).isRequired,
    handleClear: PropTypes.func.isRequired,
  };

  const { addEstimate } = useEstimate();

  const framePrices = { Steel: 200, Aluminum: 300, Carbon: 800 };
  const handlebarPrices = { Flat: 100, Riser: 120, Cruiser: 150 };
  const seatingPrices = { Upright: 100, Aero: 150, Climbing: 200 };
  const wheelPrices = { Spokes: 150, Rim: 200 };
  const breaksPrices = { Disc: 350, "V-Brake": 250, Cantilever: 400 };
  const tyrePrices = { Tube: 100, TubeLess: 200 };
  const gearPrices = { "4 Gears": 150, "6 Gears": 250, "8 Gears": 350 };

  const prices = {
    frame: framePrices[formData.frame] || 0,
    handlebar: handlebarPrices[formData.handlebar] || 0,
    seating: seatingPrices[formData.seating] || 0,
    wheel: wheelPrices[formData.wheel] || 0,
    breaks: breaksPrices[formData.breaks] || 0,
    tyre: tyrePrices[formData.tyre] || 0,
    chainAssembly: gearPrices[formData.chainAssembly] || 0,
  };

  const totalPartsPrice = Object.values(prices)
    .reduce((acc, price) => acc + price, 0)
    .toFixed(2);
  const gstAmount = (totalPartsPrice * 0.18).toFixed(2);
  const finalPrice = (
    parseFloat(totalPartsPrice) + parseFloat(gstAmount)
  ).toFixed(2);

  // Function to save estimate and navigate to Estimates page
  const handleSaveEstimate = () => {
    const newEstimate = {
      formData,
      prices,
      totalPartsPrice,
      gstAmount,
      finalPrice,
    };
    // console.log(newEstimate);
    addEstimate(newEstimate); // Save data in context

   // Show success message
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
      title: "Your bike estimate has been saved.",
    }).then(() => {
      handleClear();
    });
  };

  return (
    <>
      <div className="container ">
        <h3 className="text-center  font-bold pb-2 md:text-4xl text-2xl md:mb-4 text-[#213832]">
          {formData.brand} Cycle Price
        </h3>
        <div className="price-table-container">
          <table className="price-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Selection</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frame</td>
                <td>{formData.frame}</td>
                <td>{prices.frame}</td>
              </tr>
              <tr>
                <td>Handlebar</td>
                <td>{formData.handlebar}</td>
                <td>{prices.handlebar}</td>
              </tr>
              <tr>
                <td>Seating</td>
                <td>{formData.seating}</td>
                <td>{prices.seating}</td>
              </tr>
              <tr>
                <td>Wheel</td>
                <td>{formData.wheel}</td>
                <td>{prices.wheel}</td>
              </tr>
              <tr>
                <td>Breaks</td>
                <td>{formData.wheel}</td>
                <td>{prices.breaks}</td>
              </tr>
              <tr>
                <td>Tyre</td>
                <td>{formData.tyre}</td>
                <td>{prices.tyre}</td>
              </tr>
              <tr>
                <td>Chain Assembly</td>
                <td>{formData.chainAssembly}</td>
                <td>{prices.chainAssembly}</td>
              </tr>

              <tr className="total-row">
                <td colSpan="2">Total Price (excluding GST)</td>
                <td>₹{totalPartsPrice}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2"> 18% GST</td>
                <td>₹{gstAmount}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2">Total Price</td>
                <td>₹{finalPrice}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="3" style={{ textAlign: "center" }}>
                  <button
                    id="saveEstimate"
                    onClick={handleSaveEstimate}
                    className="bg-blue-500 text-white  font-bold p-2  rounded-md"
                  >
                    Save Estimated Price
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PriceBreakdown;
