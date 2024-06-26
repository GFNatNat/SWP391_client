import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const CutFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cutOptions = ["Poor", "Good", "Very Good", "Excellent"];

  // State to track selected cut options
  const [selectedCut, setSelectedCut] = useState([]);

  // Effect to update selected cut based on router query
  useEffect(() => {
    if (router.query.cut) {
      const selected = Array.isArray(router.query.cut)
        ? router.query.cut.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.cut
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedCut(selected);
    } else {
      setSelectedCut([]);
    }
  }, [router.query.cut]);

  // Function to handle checkbox change
  const handleCheckboxChange = (cut) => {
    const normalizedCut = cut
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedCut.includes(normalizedCut);

    // Toggle selection
    let newSelectedCut;
    if (isChecked) {
      // Remove cut if already checked
      newSelectedCut = selectedCut.filter((c) => c !== normalizedCut);
    } else {
      // Add cut if unchecked
      newSelectedCut = [...selectedCut, normalizedCut];
    }

    setSelectedCut(newSelectedCut);

    // Build query parameters
    const queryParams = newSelectedCut.map((c) => `cut=${c}`).join("&");

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
      <h3 className="tp-shop-widget-title">Cut</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {cutOptions.map((cut, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={cut}
                  type="checkbox"
                  checked={selectedCut.includes(
                    cut.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(cut)}
                />
                <label htmlFor={cut}>{cut}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CutFilter;
