import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const MainDiamondSizeFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mainDiamondSizeOptions = [
    "3ly6",
    "4ly1",
    "4ly5",
    "5ly4",
    "6ly3",
    "7ly2",
  ];

  // State to track selected mainDiamondSize options
  const [selectedMainDiamondSize, setSelectedMainDiamondSize] = useState([]);

  // Effect to update selected mainDiamondSize based on router query
  useEffect(() => {
    if (router.query.mainDiamondSize) {
      const selected = Array.isArray(router.query.mainDiamondSize)
        ? router.query.mainDiamondSize.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.mainDiamondSize
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedMainDiamondSize(selected);
    } else {
      setSelectedMainDiamondSize([]);
    }
  }, [router.query.mainDiamondSize]);

  // Function to handle checkbox change
  const handleCheckboxChange = (mainDiamondSize) => {
    const normalizedMainDiamondSize = mainDiamondSize
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedMainDiamondSize.includes(
      normalizedMainDiamondSize
    );

    // Toggle selection
    let newSelectedMainDiamondSize;
    if (isChecked) {
      // Remove mainDiamondSize if already checked
      newSelectedMainDiamondSize = selectedMainDiamondSize.filter(
        (c) => c !== normalizedMainDiamondSize
      );
    } else {
      // Add mainDiamondSize if unchecked
      newSelectedMainDiamondSize = [
        ...selectedMainDiamondSize,
        normalizedMainDiamondSize,
      ];
    }

    setSelectedMainDiamondSize(newSelectedMainDiamondSize);

    // Build query parameters
    const queryParams = newSelectedMainDiamondSize
      .map((c) => `mainDiamondSize=${c}`)
      .join("&");

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
      <h3 className="tp-shop-widget-title">Main Diamond Size</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {mainDiamondSizeOptions.map((mainDiamondSize, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={mainDiamondSize}
                  type="checkbox"
                  checked={selectedMainDiamondSize.includes(
                    mainDiamondSize
                      .toLowerCase()
                      .replace("&", "")
                      .split(" ")
                      .join("-")
                  )}
                  onChange={() => handleCheckboxChange(mainDiamondSize)}
                />
                <label htmlFor={mainDiamondSize}>{mainDiamondSize}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainDiamondSizeFilter;
