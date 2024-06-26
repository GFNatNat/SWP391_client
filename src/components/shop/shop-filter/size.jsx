import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const SizeFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const sizeOptions = ["10 mm", "12 mm", "14 mm", "16 mm"];

  // State to track selected size options
  const [selectedSize, setSelectedSize] = useState([]);

  // Effect to update selected size based on router query
  useEffect(() => {
    if (router.query.size) {
      const selected = Array.isArray(router.query.size)
        ? router.query.size.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.size
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedSize(selected);
    } else {
      setSelectedSize([]);
    }
  }, [router.query.size]);

  // Function to handle checkbox change
  const handleCheckboxChange = (size) => {
    const normalizedSize = size
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedSize.includes(normalizedSize);

    // Toggle selection
    let newSelectedSize;
    if (isChecked) {
      // Remove size if already checked
      newSelectedSize = selectedSize.filter((c) => c !== normalizedSize);
    } else {
      // Add size if unchecked
      newSelectedSize = [...selectedSize, normalizedSize];
    }

    setSelectedSize(newSelectedSize);

    // Build query parameters
    const queryParams = newSelectedSize.map((c) => `size=${c}`).join("&");

    // Construct URL based on shop or shop-right-sidebar
    router.push(
      `/${shop_right ? "shop-right-sidebar" : "shop"}${
        queryParams ? `?${queryParams}` : ""
      }`
    );

    // Close filter sidebar
    dispatch(handleFilterSidebarClose());
  };

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Product Size</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {sizeOptions.map((size, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={size}
                  type="checkbox"
                  checked={selectedSize.includes(
                    size.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(size)}
                />
                <label htmlFor={size}>{size}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeFilter;
