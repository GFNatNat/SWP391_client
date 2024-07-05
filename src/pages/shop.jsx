import React, { useState, useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";

const ShopPage = ({ query }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [caratWeightValue, setCaratWeightValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [popupMessage, setPopupMessage] = useState(null);

  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);

      // Set maximum carat weight to a dummy value (replace with actual logic)
      const maxCaratWeight = 10;
      setCaratWeightValue([0, maxCaratWeight]);
    }
  }, [isLoading, isError, products]);

  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  const handleCaratWeightChanges = (val) => {
    setCurrPage(1);
    setCaratWeightValue(val);
  };

  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    caratWeightFilterValues: {
      caratWeightValue,
      handleCaratWeightChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };

  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  } else if (isError) {
    content = (
      <div className="pb-80 text-center">
        <ErrorMsg msg="There was an error" />
      </div>
    );
  } else if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  } else if (!isLoading && !isError && products?.data?.length > 0) {
    let productItems = products.data;

    if (selectValue) {
      switch (selectValue) {
        case "Low to High":
          productItems = products.data
            .slice()
            .sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "High to Low":
          productItems = products.data
            .slice()
            .sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "New Added":
          productItems = products.data
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "On Sale":
          productItems = products.data.filter((p) => p.discount > 0);
          break;
        default:
          productItems = products.data;
      }
    }

    // Price filter
    productItems = productItems.filter(
      (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
    );

    // Carat Weight Filter
    const caratWeightFilter = (products, caratWeightValue) => {
      return products.filter((product) => {
        let caratWeight = null;

        // Check classificationAttributes for Carat Weight
        if (product.classificationAttributes) {
          const mainDiamondAttributes = product.classificationAttributes.find(
            (attr) =>
              attr.type.toLowerCase().replace(/\s+/g, "-") === "main-diamond"
          );
          if (mainDiamondAttributes) {
            const caratAttribute = mainDiamondAttributes.attributes.find(
              (attribute) =>
                attribute.key.toLowerCase().replace(/\s+/g, "-") ===
                "carat-weight"
            );
            if (caratAttribute) {
              caratWeight = caratAttribute.value.map((value) =>
                parseFloat(value.replace(" ct", ""))
              );
            }
          }
        }

        // Check mainDiamond for Carat Weight if not found in classificationAttributes
        if (
          !caratWeight &&
          product.mainDiamond &&
          product.mainDiamond.caratWeight
        ) {
          caratWeight = parseFloat(
            product.mainDiamond.caratWeight.replace(" ct", "")
          );
        }

        // If caratWeight is an array, check if any value falls within the range
        if (Array.isArray(caratWeight)) {
          return caratWeight.some(
            (weight) =>
              weight >= caratWeightValue[0] && weight <= caratWeightValue[1]
          );
        }

        // If caratWeight is a single value, check if it falls within the range
        if (caratWeight !== null) {
          return (
            caratWeight >= caratWeightValue[0] &&
            caratWeight <= caratWeightValue[1]
          );
        }

        // If no Carat Weight found, show the popup message
        setPopupMessage("No Carat Weight found for the selected product.");
        return true;
      });
    };

    // Apply the carat weight filter
    productItems = caratWeightFilter(productItems, caratWeightValue);

    // Status filter
    if (query.status) {
      if (query.status === "on-sale") {
        productItems = productItems.filter((p) => p.discount > 0);
      } else if (query.status === "in-stock") {
        productItems = productItems.filter((p) => p.status === "in-stock");
      }
    }

    const filterProducts = (products, query) => {
      return products.filter((product) => {
        let matches = true;

        // Helper function to extract attribute values
        const getAttributeValue = (attributes, key) => {
          const attr = attributes.find((attr) => attr.startsWith(`${key}|`));
          if (attr) {
            return attr
              .split("|")[1]
              .split(";")
              .map((value) => value.trim());
          }
          return null;
        };

        // Check each query parameter
        for (const [key, queryValues] of Object.entries(query)) {
          let attributeValues = getAttributeValue(
            product.classificationAttributes,
            key
          );

          if (!attributeValues) {
            const additionalInfo = product.additionalInformation.find(
              (info) => info.key.toLowerCase().replace(/\s+/g, "-") === key
            );
            if (additionalInfo) {
              attributeValues = [
                additionalInfo.value.toLowerCase().replace(/\s+/g, "-"),
              ];
            }
          }

          if (attributeValues) {
            const queryValueArray = Array.isArray(queryValues)
              ? queryValues
              : [queryValues];

            matches =
              matches &&
              queryValueArray.some((queryValue) =>
                attributeValues.includes(queryValue)
              );
          }

          if (!matches) {
            break;
          }
        }

        return matches;
      });
    };

    // Apply the filters
    productItems = filterProducts(productItems, query);

    if (query.category) {
      productItems = productItems.filter(
        (p) =>
          p.parent.toLowerCase().replace("&", "").split(" ").join("-") ===
          query.category
      );
    }

    if (query.subCategory) {
      productItems = productItems.filter(
        (p) =>
          p.children.toLowerCase().replace("&", "").split(" ").join("-") ===
          query.subCategory
      );
    }

    if (query.color) {
      productItems = productItems.filter((product) => {
        return product.imageURLs.some(
          (image) =>
            image.color &&
            image.color.name
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-") === query.color
        );
      });
    }

    if (query.brand) {
      productItems = productItems.filter(
        (p) =>
          p.brand.name.toLowerCase().replace("&", "").split(" ").join("-") ===
          query.brand
      );
    }

    content = (
      <>
        <ShopArea
          all_products={products.data}
          products={productItems}
          otherProps={otherProps}
        />
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }

  const closePopup = () => {
    setPopupMessage(null);
  };

  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      {content}
      {popupMessage && (
        <div
          className="popup"
          style={{
            position: "fixed",
            top: "10%",
            left: "0%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="popup-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            <p>{popupMessage}</p>
            <button
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                marginTop: "10px",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: {
      query,
    },
  };
};
