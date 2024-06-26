import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const MaterialFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const materialOptions = ["Gold 18k", "Gold 99k", "Silver"];

  // State to track selected material options
  const [selectedMaterial, setSelectedMaterial] = useState([]);

  // Effect to update selected material based on router query
  useEffect(() => {
    if (router.query.material) {
      const selected = Array.isArray(router.query.material)
        ? router.query.material.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.material
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedMaterial(selected);
    } else {
      setSelectedMaterial([]);
    }
  }, [router.query.material]);

  // Function to handle checkbox change
  const handleCheckboxChange = (material) => {
    const normalizedMaterial = material
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedMaterial.includes(normalizedMaterial);

    // Toggle selection
    let newSelectedMaterial;
    if (isChecked) {
      // Remove material if already checked
      newSelectedMaterial = selectedMaterial.filter(
        (c) => c !== normalizedMaterial
      );
    } else {
      // Add material if unchecked
      newSelectedMaterial = [...selectedMaterial, normalizedMaterial];
    }

    setSelectedMaterial(newSelectedMaterial);

    // Build query parameters
    const queryParams = newSelectedMaterial
      .map((c) => `material=${c}`)
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
      <h3 className="tp-shop-widget-title">Product Material</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {materialOptions.map((material, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={material}
                  type="checkbox"
                  checked={selectedMaterial.includes(
                    material.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(material)}
                />
                <label htmlFor={material}>{material}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MaterialFilter;
