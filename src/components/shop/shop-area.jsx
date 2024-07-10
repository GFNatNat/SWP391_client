import React, { useState } from "react";
import Pagination from "@/ui/Pagination";
import ProductItem from "../products/fashion/product-item";
import CategoryFilter from "./shop-filter/category-filter";
import ColorFilter from "./shop-filter/color-filter";
import PriceFilter from "./shop-filter/price-filter";
import CaratWeightFilter from "./shop-filter/carat-weight-filter";
import ProductBrand from "./shop-filter/product-brand";
import StatusFilter from "./shop-filter/status-filter";
import MaterialFilter from "./shop-filter/material";
import SizeFilter from "./shop-filter/size";
import MainDiamondColor from "./shop-filter/color";
import SideStoneFilter from "./shop-filter/side-stone";
import OriginFilter from "./shop-filter/origin";
import CutFilter from "./shop-filter/cut";
import ClarityFilter from "./shop-filter/clarity";
import TopRatedProducts from "./shop-filter/top-rated-products";
import ShopListItem from "./shop-list-item";
import ShopTopLeft from "./shop-top-left";
import ShopTopRight from "./shop-top-right";
import ResetButton from "./shop-filter/reset-button";

const ShopArea = ({ all_products, products, otherProps }) => {
  const {
    priceFilterValues,
    caratWeightFilterValues,
    selectHandleFilter,
    currPage,
    setCurrPage,
  } = otherProps;

  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(12);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  // max price
  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  // max caratWeight
  const maxCaratWeight = all_products.reduce((max, product) => {
    return 10;
    //return product.caratWeight > max ? product.caratWeight : max;
  }, 0);

  return (
    <>
      <section className="tp-shop-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4">
              <div className="tp-shop-sidebar mr-10">
                {/* filter */}
                <PriceFilter
                  priceFilterValues={priceFilterValues}
                  maxPrice={maxPrice}
                />
                <CaratWeightFilter
                  caratWeightFilterValues={caratWeightFilterValues}
                  maxCaratWeight={maxCaratWeight}
                />
                {/* material */}
                <MaterialFilter setCurrPage={setCurrPage} />
                {/* size */}
                <SizeFilter setCurrPage={setCurrPage} />
                {/* mainDiamondColor */}
                <MainDiamondColor setCurrPage={setCurrPage} />
                {/* sideStoneFilter */}
                <SideStoneFilter setCurrPage={setCurrPage} />
                {/* originFilter */}
                <OriginFilter setCurrPage={setCurrPage} />
                {/* cutFilter */}
                <CutFilter setCurrPage={setCurrPage} />
                {/* clarityFilter */}
                <ClarityFilter setCurrPage={setCurrPage} />
                {/* status */}
                <StatusFilter setCurrPage={setCurrPage} />
                {/* categories */}
                <CategoryFilter setCurrPage={setCurrPage} />
                {/* product rating */}
                <TopRatedProducts />
                {/* brand */}
                <ProductBrand setCurrPage={setCurrPage} />
                {/* reset filter */}
                <ResetButton />
              </div>
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="tp-shop-main-wrapper">
                <div className="tp-shop-top mb-45">
                  <div className="row">
                    <div className="col-xl-6">
                      <ShopTopLeft
                        showing={
                          products.length === 0
                            ? 0
                            : filteredRows.slice(
                                pageStart,
                                pageStart + countOfPage
                              ).length
                        }
                        total={all_products.length}
                      />
                    </div>
                    <div className="col-xl-6">
                      <ShopTopRight selectHandleFilter={selectHandleFilter} />
                    </div>
                  </div>
                </div>
                {products.length === 0 && <h2>No products found</h2>}
                {products.length > 0 && (
                  <div className="tp-shop-items-wrapper tp-shop-item-primary">
                    <div className="tab-content" id="productTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="grid-tab-pane"
                        role="tabpanel"
                        aria-labelledby="grid-tab"
                        tabIndex="0"
                      >
                        <div className="row">
                          {filteredRows
                            .slice(pageStart, pageStart + countOfPage)
                            .map((item) => (
                              <div
                                key={item._id}
                                className="col-xl-4 col-md-6 col-sm-6"
                              >
                                <ProductItem product={item} />
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="list-tab-pane"
                        role="tabpanel"
                        aria-labelledby="list-tab"
                        tabIndex="0"
                      >
                        <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                          <div className="row">
                            <div className="col-xl-12">
                              {filteredRows
                                .slice(pageStart, pageStart + countOfPage)
                                .map((item) => (
                                  <ShopListItem key={item._id} product={item} />
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {products.length > 0 && (
                  <div className="tp-shop-pagination mt-20">
                    <div className="tp-pagination">
                      <Pagination
                        items={products}
                        countOfPage={12}
                        paginatedData={paginatedData}
                        currPage={currPage}
                        setCurrPage={setCurrPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopArea;
