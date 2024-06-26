import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const ColorFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const colorOptions = ["D", "H", "N", "Z"];

  // State to track selected color options
  const [selectedColor, setSelectedColor] = useState([]);

  // Effect to update selected color based on router query
  useEffect(() => {
    if (router.query.color) {
      const selected = Array.isArray(router.query.color)
        ? router.query.color.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.color
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedColor(selected);
    } else {
      setSelectedColor([]);
    }
  }, [router.query.color]);

  // Function to handle checkbox change
  const handleCheckboxChange = (color) => {
    const normalizedColor = color
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedColor.includes(normalizedColor);

    // Toggle selection
    let newSelectedColor;
    if (isChecked) {
      // Remove color if already checked
      newSelectedColor = selectedColor.filter((c) => c !== normalizedColor);
    } else {
      // Add color if unchecked
      newSelectedColor = [...selectedColor, normalizedColor];
    }

    setSelectedColor(newSelectedColor);

    // Build query parameters
    const queryParams = newSelectedColor.map((c) => `color=${c}`).join("&");

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
      <h3 className="tp-shop-widget-title">Main Diamond Color</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {colorOptions.map((color, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={color}
                  type="checkbox"
                  checked={selectedColor.includes(
                    color.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(color)}
                />
                <label htmlFor={color}>{color}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorFilter;
