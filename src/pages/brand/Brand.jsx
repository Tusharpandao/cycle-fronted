import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 5;

  // Auth config
  const authConfig = {
    auth: {
      username: "Admin",
      password: "admin123",
    },
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/brand/brands");
      setBrands(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to fetch brands",
      });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Add this useEffect to handle pagination when brands change
  useEffect(() => {
    const totalPages = Math.ceil(brands.length / brandsPerPage);
    // If current page is greater than total pages and brands exist,
    // set current page to last available page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [brands.length, currentPage, brandsPerPage]);

  // Add brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Brand name cannot be empty",
      });
      return;
    }

    try {
    
      await axios.post(
        `http://localhost:8080/brand/add?name=${newBrandName}`,
        null,
        authConfig
      );

      await fetchBrands();
      setIsAddModalOpen(false);
      setNewBrandName("");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Brand added successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to add brand",
      });
    }
  };

  // Edit brand
  const handleEditBrand = async () => {
    if (!newBrandName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Brand name cannot be empty",
      });
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/brand/update`,
        {
          id: editingBrand.id,
          newBrandName: newBrandName,
        },

        authConfig
      );

      await fetchBrands();
      setIsEditModalOpen(false);
      setNewBrandName("");
      setEditingBrand(null);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Brand updated successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to update brand",
      });
    }
  };

  // Modified delete handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8080/brand/delete/${id}`,
            authConfig
          );

          // Get the current number of brands on the page
          const currentPageBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);
          
          // If this is the last item on the page and not the first page,
          // decrease the current page
          if (currentPageBrands.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }

          await fetchBrands();

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Brand has been deleted.",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data || "Failed to delete brand",
          });
        }
      }
    });
  };

  const handleViewItems = (brandName) => {
    navigate("/items", { state: { selectedBrand: brandName } });
  };

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(brands.length / brandsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Brand Button */}
      <div className="mb-5 w-full md:w-3/4 mx-auto">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Brand
        </button>
      </div>

      {/* Modified Brands Table */}
      <div className="overflow-x-auto w-full md:w-3/4 mx-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Brand Name</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBrands.map((brand) => (
              <tr key={brand.id} className="border-b hover:bg-gray-200">
                <td className="px-6 py-4">{brand.name}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => handleViewItems(brand.name)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center text-sm"
                    >
                      <FaList className="mr-1 hidden sm:block" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingBrand(brand);
                        setNewBrandName(brand.name);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Brand</h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Enter brand name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewBrandName("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Brand</h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Enter new brand name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setNewBrandName("");
                  setEditingBrand(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBrand}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
