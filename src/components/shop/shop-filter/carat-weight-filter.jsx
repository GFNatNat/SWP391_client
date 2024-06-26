import React from "react";
import InputRange from "@/ui/input-range"; // Assuming correct path to InputRange component

const CaratWeightFilter = ({ caratWeightFilterValues, maxCaratWeight }) => {
  if (!caratWeightFilterValues) {
    return null; // or some fallback UI
  }

  const { caratWeightValue, handleCaratWeightChanges } =
    caratWeightFilterValues;

  return (
    <div className="tp-shop-widget mb-35">
      <h3 className="tp-shop-widget-title no-border">CaratWeight Filter</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-filter">
          <div id="slider-range" className="mb-10">
            <InputRange
              STEP={0.01}
              MIN={0}
              MAX={maxCaratWeight}
              values={caratWeightValue}
              handleChanges={handleCaratWeightChanges}
            />
          </div>
          <div className="tp-shop-widget-filter-info d-flex align-items-center justify-content-between">
            <span className="input-range">
              {caratWeightValue[0]} ct - {caratWeightValue[1]} ct
            </span>
            <button className="tp-shop-widget-filter-btn" type="button">
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaratWeightFilter;
