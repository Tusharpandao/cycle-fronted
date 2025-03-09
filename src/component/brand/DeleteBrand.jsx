import React from "react";
import axios from "axios";
import { FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const DeleteBrand = ({ brand, onClose, onDeleteSuccess }) => {
  // Match the authConfig from GetBrand.jsx
  const authConfig = {
    auth: {
      username: "Admin",
      password: "admin123",
    },
  };

  const handleDelete = async () => {
    try {
      // Updated to match GetBrand.jsx endpoint
      const response = await axios.delete(
        `http://localhost:8080/brand/delete/${brand.id}`,
        authConfig
      );

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Brand has been deleted.',
        timer: 1500,
        showConfirmButton: false
      });

      onDeleteSuccess();
      onClose();

    } catch (error) {
      console.error("Error deleting brand:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data || 'Failed to delete brand',
        confirmButtonColor: '#3085d6'
      });
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
      <div className="bg-red-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Delete Brand
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 rounded-full p-4 mb-4">
            <FaExclamationTriangle className="h-12 w-12 text-red-500" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Are you sure you want to delete this brand?
          </h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Brand Name:</p>
            <p className="text-lg font-semibold text-gray-900">
              {brand.name || brand.brandName}
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-700">
              This action will delete the brand and all related items. 
              This cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3 w-full">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md 
                        hover:bg-gray-200 focus:outline-none focus:ring-2 
                        focus:ring-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-md 
                        hover:bg-red-700 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-red-500 
                        transition-all font-medium flex items-center"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete Brand
            </motion.button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 text-center">
        <p>This action is permanent and cannot be reversed</p>
      </div>
    </motion.div>
  );
};

export default DeleteBrand; 