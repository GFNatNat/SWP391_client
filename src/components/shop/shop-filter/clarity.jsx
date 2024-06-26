import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const ClarityFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const clarityOptions = ["FL", "IF", "VVS", "VS", "SI", "VVS1"];

  // State to track selected clarity options
  const [selectedClarity, setSelectedClarity] = useState([]);

  // Effect to update selected clarity based on router query
  useEffect(() => {
    if (router.query.clarity) {
      const selected = Array.isArray(router.query.clarity)
        ? router.query.clarity.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.clarity
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedClarity(selected);
    } else {
      setSelectedClarity([]);
    }
  }, [router.query.clarity]);

  // Function to handle checkbox change
  const handleCheckboxChange = (clarity) => {
    const normalizedClarity = clarity
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedClarity.includes(normalizedClarity);

    // Toggle selection
    let newSelectedClarity;
    if (isChecked) {
      // Remove clarity if already checked
      newSelectedClarity = selectedClarity.filter(
        (c) => c !== normalizedClarity
      );
    } else {
      // Add clarity if unchecked
      newSelectedClarity = [...selectedClarity, normalizedClarity];
    }

    setSelectedClarity(newSelectedClarity);

    // Build query parameters
    const queryParams = newSelectedClarity.map((c) => `clarity=${c}`).join("&");

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
      <h3 className="tp-shop-widget-title">Clarity</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {clarityOptions.map((clarity, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={clarity}
                  type="checkbox"
                  checked={selectedClarity.includes(
                    clarity.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(clarity)}
                />
                <label htmlFor={clarity}>{clarity}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClarityFilter;
