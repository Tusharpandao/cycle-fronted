import React, { useState } from "react";
import axios from "axios";
import { FaSpinner, FaTimes, FaPencilAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const UpdateBrand = ({ brand, onClose, onUpdateSuccess }) => {
  const [brandName, setBrandName] = useState(brand.name);
  const [loading, setLoading] = useState(false);

  // Match the authConfig from GetBrand.jsx
  const authConfig = {
    auth: {
      username: "Admin",
      password: "admin123",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Brand name cannot be empty!',
        timer: 1500
      });
      return;
    }

    setLoading(true);
  
    try {
      // Updated to match GetBrand.jsx endpoint structure
      const response = await axios.patch(
        `http://localhost:8080/brand/update`,
        {
          id: brand.id,
          newBrandName: brandName
        },
        authConfig
      );

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Brand updated successfully!`,
        timer: 1500,
        showConfirmButton: false
      });

      onUpdateSuccess();
      onClose();

    } catch (error) {
      console.error("Error updating brand:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data || 'Failed to update brand',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaPencilAlt className="mr-2" />
            Update Brand
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="brandName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Brand Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 text-lg"
                placeholder="Enter brand name"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                transition-all font-medium flex items-center ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  Updating...
                </>
              ) : (
                'Update Brand'
              )}
            </motion.button>
          </div>
        </div>
      </form>

      {/* Optional: Add a divider and additional information */}
      <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
        Last modified by: {brand.modifiedBy || 'N/A'} • 
        Last updated: {brand.modifiedOn || 'N/A'}
      </div>
    </motion.div>
  );
};

export default UpdateBrand; 