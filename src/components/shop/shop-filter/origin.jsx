import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const OriginFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const originOptions = ["Natural", "Lab Grown"];

  // State to track selected origin options
  const [selectedOrigin, setSelectedOrigin] = useState([]);

  // Effect to update selected origin based on router query
  useEffect(() => {
    if (router.query.origin) {
      const selected = Array.isArray(router.query.origin)
        ? router.query.origin.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.origin
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedOrigin(selected);
    } else {
      setSelectedOrigin([]);
    }
  }, [router.query.origin]);

  // Function to handle checkbox change
  const handleCheckboxChange = (origin) => {
    const normalizedOrigin = origin
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedOrigin.includes(normalizedOrigin);

    // Toggle selection
    let newSelectedOrigin;
    if (isChecked) {
      // Remove origin if already checked
      newSelectedOrigin = selectedOrigin.filter((c) => c !== normalizedOrigin);
    } else {
      // Add origin if unchecked
      newSelectedOrigin = [...selectedOrigin, normalizedOrigin];
    }

    setSelectedOrigin(newSelectedOrigin);

    // Build query parameters
    const queryParams = newSelectedOrigin.map((c) => `origin=${c}`).join("&");

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
      <h3 className="tp-shop-widget-title">Origin</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {originOptions.map((origin, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={origin}
                  type="checkbox"
                  checked={selectedOrigin.includes(
                    origin.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(origin)}
                />
                <label htmlFor={origin}>{origin}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OriginFilter;
