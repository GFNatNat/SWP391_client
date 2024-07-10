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

    const filterProducts = (products, query) => {
      return products.filter((product) => {
        let matches = true;

        // Helper function to extract attribute values
        const getAttributeValue = (attributes, key) => {
          const attr = attributes.find((attr) => attr.key === key);
          if (attr) {
            return attr.value.map((value) =>
              value.trim().toLowerCase().replace(/\s+/g, "-")
            );
          }
          return null;
        };

        // Collect all attribute values from classificationAttributes, mainDiamond, diamondShell, and sideStone
        const collectAttributes = (product) => {
          let attributes = [];

          // From classificationAttributes
          if (product.classificationAttributes) {
            product.classificationAttributes.forEach((classification) => {
              classification.attributes.forEach((attr) => {
                const key = attr.key.toLowerCase().replace(/\s+/g, "-");
                const value = attr.value.map((value) =>
                  value.trim().toLowerCase().replace(/\s+/g, "-")
                );

                const existingAttr = attributes.find((a) => a.key === key);
                if (existingAttr) {
                  existingAttr.value = [
                    ...new Set([...existingAttr.value, ...value]),
                  ];
                } else {
                  attributes.push({ key, value });
                }
              });
            });
          }

          // Helper function to add attributes from an object with specific keys
          const addAttributesFromObject = (obj, prefix, keysMap) => {
            Object.keys(obj).forEach((key) => {
              if (obj[key] !== undefined && obj[key] !== null) {
                const mappedKey =
                  keysMap[key] ||
                  `${prefix}-${key.toLowerCase().replace(/\s+/g, "-")}`;
                const value = [
                  obj[key].toString().toLowerCase().replace(/\s+/g, "-"),
                ];

                const existingAttr = attributes.find(
                  (a) => a.key === mappedKey
                );
                if (existingAttr) {
                  existingAttr.value = [
                    ...new Set([...existingAttr.value, ...value]),
                  ];
                } else {
                  attributes.push({ key: mappedKey, value });
                }
              }
            });
          };

          // From mainDiamond
          if (product.mainDiamond) {
            const mainDiamondKeysMap = {
              origin: "origin",
              cut: "cut",
              color: "color",
              clarity: "clarity",
              caratWeight: "carat-weight",
            };
            addAttributesFromObject(
              product.mainDiamond,
              "mainDiamond",
              mainDiamondKeysMap
            );
          }

          // From diamondShell
          if (product.diamondShell) {
            const diamondShellKeysMap = {
              material: "material",
              size: "size",
            };
            addAttributesFromObject(
              product.diamondShell,
              "diamondShell",
              diamondShellKeysMap
            );
          }

          // From sideStone
          if (product.sideStone) {
            const sideStoneKeysMap = {
              sideStoneName: "side-stone",
            };
            addAttributesFromObject(
              product.sideStone,
              "sideStone",
              sideStoneKeysMap
            );
          }

          return attributes;
        };

        const productAttributes = collectAttributes(product);

        // Apply query filters
        for (let key in query) {
          const queryValues = Array.isArray(query[key])
            ? query[key]
            : [query[key]];
          const processedQueryValues = queryValues.map((queryValue) =>
            queryValue.toLowerCase().replace(/\s+/g, "-")
          );
          const attributeValues = getAttributeValue(
            productAttributes,
            key.toLowerCase().replace(/\s+/g, "-")
          );

          const matchesAnyValue = processedQueryValues.some(
            (queryValue) =>
              attributeValues && attributeValues.includes(queryValue)
          );

          if (!matchesAnyValue) {
            matches = false;
            break;
          }
        }

        // Apply brand filter
        if (query.brand) {
          const brandValue = query.brand
            .toLowerCase()
            .replace("&", "")
            .split(" ")
            .join("-");
          if (
            !product.brand ||
            product.brand.name
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-") !== brandValue
          ) {
            matches = false;
          }
        }

        // Apply category filter
        if (query.category) {
          const categoryValue = query.category
            .toLowerCase()
            .replace("&", "")
            .split(" ")
            .join("-");
          if (
            !product.category ||
            product.category.name
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-") !== categoryValue
          ) {
            matches = false;
          }
        }

        // Apply subCategory filter
        if (query.subCategory) {
          const subCategoryValue = query.subCategory
            .toLowerCase()
            .replace("&", "")
            .split(" ")
            .join("-");
          if (
            !product.children ||
            product.children
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-") !== subCategoryValue
          ) {
            matches = false;
          }
        }

        // Apply status filter
        if (query.status) {
          if (query.status === "on-sale") {
            if (product.discount <= 0) {
              matches = false;
            }
          } else if (query.status === "in-stock") {
            if (product.status !== "in-stock") {
              matches = false;
            }
          }
        }

        return matches;
      });
    };

    // Apply the filters
    productItems = filterProducts(productItems, query);

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
