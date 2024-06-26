import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const SideStoneFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const sideStoneOptions = ["Quartz", "Emerald", "BloodStone"];

  // State to track selected sideStone options
  const [selectedSideStone, setSelectedSideStone] = useState([]);

  // Effect to update selected sideStone based on router query
  useEffect(() => {
    if (router.query.sideStone) {
      const selected = Array.isArray(router.query.sideStone)
        ? router.query.sideStone.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.sideStone
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedSideStone(selected);
    } else {
      setSelectedSideStone([]);
    }
  }, [router.query.sideStone]);

  // Function to handle checkbox change
  const handleCheckboxChange = (sideStone) => {
    const normalizedSideStone = sideStone
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedSideStone.includes(normalizedSideStone);

    // Toggle selection
    let newSelectedSideStone;
    if (isChecked) {
      // Remove sideStone if already checked
      newSelectedSideStone = selectedSideStone.filter(
        (c) => c !== normalizedSideStone
      );
    } else {
      // Add sideStone if unchecked
      newSelectedSideStone = [...selectedSideStone, normalizedSideStone];
    }

    setSelectedSideStone(newSelectedSideStone);

    // Build query parameters
    const queryParams = newSelectedSideStone
      .map((c) => `sideStone=${c}`)
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
      <h3 className="tp-shop-widget-title">Side stone</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {sideStoneOptions.map((sideStone, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={sideStone}
                  type="checkbox"
                  checked={selectedSideStone.includes(
                    sideStone
                      .toLowerCase()
                      .replace("&", "")
                      .split(" ")
                      .join("-")
                  )}
                  onChange={() => handleCheckboxChange(sideStone)}
                />
                <label htmlFor={sideStone}>{sideStone}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideStoneFilter;
