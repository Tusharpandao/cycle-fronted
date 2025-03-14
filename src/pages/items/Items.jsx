/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList } from "react-icons/fa";
import AddItem from "../../component/item/AddItem";
import UpdateDateTime from "../../component/item/UpdateDateTime";
import UpdatePrice from "../../component/item/UpdatePrice";
import { useLocation, useNavigate } from 'react-router-dom';

function Items ()  {
  const location = useLocation();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateDateModalOpen, setIsUpdateDateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdatePriceModalOpen, setIsUpdatePriceModalOpen] = useState(false);
  const [selectedItemForPrice, setSelectedItemForPrice] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const authConfig = {
    auth: {
      username: "Admin",
      password: "admin123",
    },
  };

  // Add this useEffect for search functionality
  useEffect(() => {
    if (searchName.trim() === '') {
      setFilteredItems([]);
      return;
    }

    const filtered = items.filter(item =>
      item.itemName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredItems(filtered);
    console.log(filtered);
  }, [searchName, items]); // Dependencies: searchName and items

    // Move fetchItemsForBrand outside useEffect and memoize it
    const fetchItemsForBrand = useCallback(async (brandName) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/item/brand/${brandName}`
        );
        setItems(response.data);
        setCurrentPage(1);
      } catch (error) {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : "Failed to fetch items";
        setItems([]);
        setCurrentPage(1);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    }, []);
  // Separate useEffect for initial brands fetch
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8080/brand/brands");
        setBrands(response.data);
        
        // If we have a selected brand from navigation, use that
        if (location.state?.selectedBrand) {
          setSelectedBrand(location.state.selectedBrand);
          fetchItemsForBrand(location.state.selectedBrand);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data || "Failed to fetch brands",
        });
      }
    };

    fetchBrands();
  }, [location.state?.selectedBrand, fetchItemsForBrand]); // Add dependencies

 // Empty dependency array as it doesn't depend on any props or state

  // Modify handleBrandChange to use the new fetchItemsForBrand function
  const handleBrandChange = async (e) => {
    const brandName = e.target.value;
    setSelectedBrand(brandName);
    setSearchName('');
    setFilteredItems([]);
    await fetchItemsForBrand(brandName);
  };

  // Pagination logic

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.length > 0 
    ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    : items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (filteredItems.length > 0 ? filteredItems.length : items.length) / itemsPerPage
  );

  // Add this useEffect to handle pagination when items change
  useEffect(() => {
    const totalPages = Math.ceil(
      (filteredItems.length > 0 ? filteredItems.length : items.length) / itemsPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items.length, filteredItems.length, currentPage, itemsPerPage]);



  const handleEditValidTo = (itemId, validTo) => {
    console.log('ItemId:', itemId, 'ValidTo:', validTo); // Debug log
    setSelectedItem({ itemId, validTo });
    setIsUpdateDateModalOpen(true);
  };

  const handleDelete = (itemId) => {
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
          const response = await axios.delete(
            `http://localhost:8080/item/delete/${itemId}`,
            authConfig
          );
          if (response.status === 200) {
            // Get current page items before deletion
            const currentPageItems = filteredItems.length > 0 
              ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
              : items.slice(indexOfFirstItem, indexOfLastItem);

            // If this is the last item on the page and not the first page,
            // decrease the current page
            if (currentPageItems.length === 1 && currentPage > 1) {
              setCurrentPage(prev => prev - 1);
            }

            // Remove the deleted item from the items array
            setItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
            
            // Also update filtered items if search is active
            if (filteredItems.length > 0) {
              setFilteredItems(prevFiltered => 
                prevFiltered.filter(item => item.itemId !== itemId)
              );
            }

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Item Deleted Successfully",
              text: response.data,
              showConfirmButton: false,
              timer: 1000
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete item",
          });
        }
      }
    });
  };

  // Function to format date to 'yyyy-MM-dd HH:mm:ss'
  // const formatDateTime = (dateTimeString) => {
  //   const date = new Date(dateTimeString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   const seconds = "00"; // Default seconds to 00

  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // };

  const handleItemAdded = async () => {
    try {
      // Refresh items list after adding new item
      const response = await axios.get(
        `http://localhost:8080/item/brand/${selectedBrand}`
      );
      setItems(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to refresh items list",
      });
    }
  };

  const handleUpdateSuccess = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/item/brand/${selectedBrand}`
      );
      setItems(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to refresh items list",
      });
    }
  };

  const handleEditPrice = (itemId, price) => {
    // console.log('ItemId:', itemId, 'Price:', price);
    setSelectedItemForPrice({ itemId, price });
    setIsUpdatePriceModalOpen(true);
  };

  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-center">
        <div className="w-2/3 flex flex-col justify-center items-center">
          <label className="block text-gray-200 text-xl font-bold mb-4 text-center">
            {selectedBrand 
              ? `Managing Items for ${selectedBrand}`
              : "Select a Brand to View and Manage Items"}
          </label>
          <div className="flex items-center gap-4">
            <select
              className="w-64 p-2 border rounded"
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              <option value="" disabled>
                Select a brand
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
            {!selectedBrand && (
              <button
                onClick={() => navigate('/brand')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <FaList className="mr-2" /> Manage Brands
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedBrand ? (
        <>
          <div className="mb-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Item
            </button>
          </div>

          {items.length > 0 ? (
            <div className="mb-5 flex items-center gap-4">
              <input
                type="text"
                placeholder="Search by item name..."
                className="p-2 border rounded"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              {searchName.length > 0 && (
                <button
                  onClick={() => {
                    setSearchName('');
                    setFilteredItems([]);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-200 mt-8">
              <p>No items found for this brand.</p>
              <p>Click Add Item to add your first item.</p>
            </div>
          )}

          {currentItems.length > 0 && (
            <div className="mb-4">
              {filteredItems.length > 0 ? (
                <p className="text-gray-600">
                  Found {filteredItems.length} item(s) matching : {searchName}
                </p>
              ) : searchName ? (
                <p className="text-gray-600">No items found matching : {searchName} </p>
              ) : null}
            </div>
          )}

          {currentItems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Item Name</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Valid To</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.itemId} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{item.itemName}</td>
                      <td className="px-6 py-4">{item.itemType}</td>
                      <td className="px-6 py-4">
                        {Number(item.price).toFixed(2)}
                        <button
                          onClick={() => handleEditPrice(item.itemId, item.price)}
                          className="text-blue-600 hover:text-blue-800 ml-2"
                        >
                          <FaEdit />
                        </button>
                      </td>
                      <td className="px-6 py-4">{item.validTo}  <button
                          onClick={() => handleEditValidTo(item.itemId , item.validTo)} 
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <FaEdit />
                        </button></td>
                      <td className="px-6 py-4">
                       
                        <button
                          onClick={() => handleDelete(item.itemId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Improved Pagination */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-200 mt-8">
          <p>Please select a brand to view and manage items.</p>
          <p>You can also go to the Brands page to manage your brands.</p>
        </div>
      )}

      <AddItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedBrand={selectedBrand}
        onItemAdded={handleItemAdded}
        authConfig={authConfig}
      />


      {selectedItem && (
        <UpdateDateTime
          isOpen={isUpdateDateModalOpen}
          onClose={() => setIsUpdateDateModalOpen(false)}
          itemId={selectedItem.itemId}
          currentValidTo={selectedItem.validTo}
          authConfig={authConfig}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {selectedItemForPrice && (
        <UpdatePrice
          isOpen={isUpdatePriceModalOpen}
          onClose={() => setIsUpdatePriceModalOpen(false)}
          itemId={selectedItemForPrice.itemId}
          currentPrice={selectedItemForPrice.price}
          authConfig={authConfig}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Items;
