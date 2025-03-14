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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);

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

      // Check if the response data is empty
      if (response.data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Brands Found",
          text: "There are no brands available. Please add a new brand.",
        });
      }
    } catch (error) {
      setBrands([]); // Clear brands on error
      if (error.code === "ERR_NETWORK") {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Unable to connect to the server. Please try again later.",
          footer: '<a href="#">Need help?</a>',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data || "Failed to fetch brands. Please try again.",
        });
      }
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

  // Add this useEffect for search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBrands([]);
      return;
    }

    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

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
          const currentPageBrands = brands.slice(
            indexOfFirstBrand,
            indexOfLastBrand
          );

          // If this is the last item on the page and not the first page,
          // decrease the current page
          if (currentPageBrands.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
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
  const currentBrands =
    filteredBrands.length > 0
      ? filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand)
      : brands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(
    (filteredBrands.length > 0 ? filteredBrands.length : brands.length) /
      brandsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {brands.length > 0 ? (
        <div>
          {/* Add Brand Button */}
          <div className="mb-5 w-full md:w-3/4 mx-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Brand
            </button>
          </div>

          <div className="mb-5 w-3/4 mx-auto flex items-center gap-4">
            <input
              type="text"
              placeholder="Search brands..."
              className="p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Add Search Results Info */}
          {searchTerm && (
            <div className="mb-4 w-full md:w-3/4 mx-auto">
              {filteredBrands.length > 0 ? (
                <p className="text-gray-600">
                  Found {filteredBrands.length} brand(s) matching: {searchTerm}
                </p>
              ) : (
                <p className="text-gray-600">
                  No brands found matching: {searchTerm}
                </p>
              )}
            </div>
          )}

          {/* Add this conditional rendering for the table */}
          {/* {brands.length > 0 ? ( */}
          <div className="overflow-x-auto w-full md:w-3/4 mx-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-center">Brand Name</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBrands.map((brand) => (
                  <tr key={brand.id} className="border-b hover:bg-gray-200">
                    <td className="px-6 py-4 text-center">{brand.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center  items-center gap-9">
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

            {/* Modify pagination to show only when there are brands */}
            {(filteredBrands.length > 0 ||
              (!searchTerm && brands.length > 0)) &&
              totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
        </div>
      ) : (
        <div className="w-full md:w-3/4 mx-auto text-center py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-lg mb-4">
              {searchTerm
                ? "No brands found matching your search."
                : "No brands available at the moment."}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center mx-auto"
            >
              <FaPlus className="mr-2" /> Add Your First Brand
            </button>
          </div>
        </div>
      )}

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
