import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { useDispatch } from "react-redux";
import Link from "next/link";
// internal
import { AskQuestion, CompareTwo, WishlistTwo } from "@/svg";
import DetailsBottomInfo from "./details-bottom-info";
import ProductDetailsCountdown from "./product-details-countdown";
import ProductQuantity from "./product-quantity";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";
import { handleModalClose } from "@/redux/features/productModalSlice";

const DetailsWrapper = ({
  productItem,
  handleImageActive,
  activeImg,
  detailsBottom = false,
}) => {
  const {
    sku,
    img,
    title,
    imageURLs,
    category,
    description,
    discount,
    price,
    quantity,
    lowestPrice,
    highestPrice,
    status,
    mainDiamond,
    diamondShell,
    sideStone,
    processingFee,
    classificationAttributes,
    productSpecifications,
    productVariants,
    reviews,
    tags,
    offerDate,
  } = productItem || {};
  const [ratingVal, setRatingVal] = useState(0);
  const [textMore, setTextMore] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  useEffect(() => {
    // Pre-select the first attribute value for each attribute of each type
    const initialSelectedAttributes = {};
    classificationAttributes.forEach((typeObj) => {
      const type = typeObj.type;
      const attributes = typeObj.attributes;
      initialSelectedAttributes[type] = {};
      attributes.forEach((attribute) => {
        initialSelectedAttributes[type][attribute.key] = attribute.value[0];
      });
    });
    setSelectedAttributes(initialSelectedAttributes);
  }, [classificationAttributes]);

  useEffect(() => {
    // Normalize and replace spaces with hyphens
    const normalize = (str) => str.toLowerCase().replace(/ /g, "-");

    // Check if each type in selectedAttributes has values for all its attributes
    const updatedSpecifications = [];

    for (const typeObj of classificationAttributes) {
      const type = typeObj.type;
      const attributes = typeObj.attributes;

      // Check if selectedAttributes[type] exists and has values for all attributes of this type
      if (
        selectedAttributes[type] &&
        attributes.every((attr) => selectedAttributes[type][attr.key])
      ) {
        // Find the specification object that matches the current type
        const spec = productSpecifications.find((spec) => spec.type === type);
        // Extract key-value pairs from selectedAttributes[type]
        const selectedAttributesEntries = Object.entries(
          selectedAttributes[type]
        );
        if (spec) {
          // Filter sets that match all selected values
          const sets = spec.sets.filter((set) =>
            selectedAttributesEntries.every((attr) =>
              set.set_values.some(
                (value) =>
                  normalize(value.key) === normalize(attr[0]) &&
                  normalize(value.value) === normalize(attr[1])
              )
            )
          );
          if (sets.length > 0) {
            updatedSpecifications.push({ type, sets });
          } else {
            console.log(`No sets found for type: ${type}`);
            // Show popup when no sets found
            const selectedValues = selectedAttributes[type];
            const selectedValuesString = Object.keys(selectedValues)
              .map((key) => `${key}: ${selectedValues[key]}`)
              .join(", ");
            const errorMessage = `set type: ${type} {${selectedValuesString}} chưa được define giá, vui lòng chọn set khác hoặc liên hệ admin hỗ trợ thêm giá.`;
            setPopupMessage(errorMessage);
          }
        } else {
          console.log(`No sets found for type: ${type}`);
          const errorMessage = `set type: ${type} chưa được define giá, vui lòng chọn set khác hoặc liên hệ admin hỗ trợ thêm giá.`;
          setPopupMessage(errorMessage);
        }
      }
    }

    setSelectedSpecifications(updatedSpecifications);
  }, [selectedAttributes, productSpecifications]);

  // Update selectedVariant based on selectedSpecifications
  useEffect(() => {
    console.log(selectedSpecifications);
    const newSelectedVariant = findVariantBySpecifications(
      selectedSpecifications
    );
    setSelectedVariant(newSelectedVariant);
  }, [selectedSpecifications]);

  // Function to handle attribute changes
  const handleAttributeChange = (type, key, value) => {
    setSelectedAttributes((prevAttributes) => ({
      ...prevAttributes,
      [type]: { ...prevAttributes[type], [key]: value },
    }));
  };

  const findVariantBySpecifications = (specifications) => {
    // Filter product variants based on selected specifications
    return productVariants.find((variant) => {
      return specifications.every((spec) => {
        return variant.productVariantAttributes.some((attr) => {
          return (
            attr.type === spec.type &&
            attr.set.set_values.every((setValue) => {
              return spec.sets.some((set) => {
                return set.set_values.some(
                  (value) =>
                    value.key === setValue.key && value.value === setValue.value
                );
              });
            })
          );
        });
      });
    });
  };

  // Function to close popup
  const closePopup = () => {
    setPopupMessage(null);
  };

  // handle add product
  const handleAddProduct = (prd, variant) => {
    const productToAdd = variant ? { ...prd, selectedVariant: variant } : prd;
    dispatch(add_cart_product(productToAdd));
  };

  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category.name}</span>
      </div>
      <h3 className="tp-product-details-title">{title}</h3>
      {/* inventory details */}
      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
        <div className="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
          <div className="tp-product-details-rating">
            <Rating
              allowFraction
              size={16}
              initialValue={ratingVal}
              readonly={true}
            />
          </div>
          <div className="tp-product-details-reviews">
            <span>
              ({reviews && reviews.length > 0 ? reviews.length : 0} Review)
            </span>
          </div>
        </div>
      </div>
      <p>
        {textMore ? description : `${description.substring(0, 100)}...`}
        <span onClick={() => setTextMore(!textMore)}>
          {textMore ? "See less" : "See more"}
        </span>
      </p>
      {/* price */}
      <div className="tp-product-details-price-wrapper mb-20">
        {selectedVariant ? (
          <>
            {discount > 0 ? (
              <>
                <span className="tp-product-details-price old-price">
                  ${selectedVariant.finalPrice}
                </span>
                <span className="tp-product-details-price new-price">
                  {" "}
                  $
                  {(
                    Number(selectedVariant.finalPrice) -
                    (Number(selectedVariant.finalPrice) * Number(discount)) /
                      100
                  ).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="tp-product-details-price new-price">
                ${selectedVariant.finalPrice.toFixed(2)}
              </span>
            )}
          </>
        ) : (
          <span className="tp-product-details-price new-price">
            ${price.toFixed(2)}
          </span>
        )}
      </div>
      {/* Render classificationAttributes */}
      {classificationAttributes.map((attributeGroup, index) => (
        <div key={index}>
          <h5>{attributeGroup.type}</h5>
          <div className="attribute-options">
            {attributeGroup.attributes.map((attribute) => (
              <div key={`${attributeGroup.type}-${attribute.key}`}>
                <h6>{attribute.key}</h6>
                {attribute.value.map((value) => (
                  <div key={`${attributeGroup.type}-${attribute.key}-${value}`}>
                    <input
                      type="radio"
                      id={`${attributeGroup.type}-${attribute.key}-${value}`}
                      name={`${attributeGroup.type}-${attribute.key}`}
                      value={value}
                      checked={
                        selectedAttributes[attributeGroup.type]?.[
                          attribute.key
                        ] === value
                      }
                      onChange={() =>
                        handleAttributeChange(
                          attributeGroup.type,
                          attribute.key,
                          value
                        )
                      }
                    />
                    <label
                      htmlFor={`${attributeGroup.type}-${attribute.key}-${value}`}
                    >
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* quantity*/}
      <div className="tp-product-details-quantity mb-15 w-100">
        {selectedVariant ? (
          <span>Remain stock: {selectedVariant.quantity}</span>
        ) : (
          <span>Remain stock: {quantity}</span>
        )}
      </div>
      {/* variations */}
      {imageURLs.some((item) => item?.color && item?.color?.name) && (
        <div className="tp-product-details-variation">
          <div className="tp-product-details-variation-item">
            <h4 className="tp-product-details-variation-title">Color :</h4>
            <div className="tp-product-details-variation-list">
              {imageURLs.map((item, i) => (
                <button
                  onClick={() => handleImageActive(item)}
                  key={i}
                  type="button"
                  className={`color tp-color-variation-btn ${
                    item.img === activeImg ? "active" : ""
                  }`}
                >
                  <span
                    data-bg-color={`${item.color.clrCode}`}
                    style={{ backgroundColor: `${item.color.clrCode}` }}
                  ></span>
                  {item.color && item.color.name && (
                    <span className="tp-color-variation-tootltip">
                      {item.color.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* if ProductDetailsCountdown true start */}
      {offerDate?.endDate && (
        <ProductDetailsCountdown offerExpiryTime={offerDate?.endDate} />
      )}
      {/* if ProductDetailsCountdown true end */}
      {/* actions */}
      <div className="tp-product-details-action-wrapper">
        <h3 className="tp-product-details-action-title">Quantity</h3>
        <div className="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
          {/* product quantity */}
          <ProductQuantity />
          {/* product quantity */}
          <div className="tp-product-details-add-to-cart mb-15 w-100">
            <button
              onClick={() => handleAddProduct(productItem, selectedVariant)}
              disabled={status === "out-of-stock"}
              className="tp-product-details-add-to-cart-btn w-100"
            >
              Add To Cart
            </button>
          </div>
        </div>
        <Link href="/cart" onClick={() => dispatch(handleModalClose())}>
          <button className="tp-product-details-buy-now-btn w-100">
            Buy Now
          </button>
        </Link>
      </div>
      {/* product-details-action-sm start */}
      <div className="tp-product-details-action-sm">
        <button
          disabled={status === "out-of-stock"}
          onClick={() => handleCompareProduct(productItem)}
          type="button"
          className="tp-product-details-action-sm-btn"
        >
          <CompareTwo />
          Compare
        </button>
        <button
          disabled={status === "out-of-stock"}
          onClick={() => handleWishlistProduct(productItem)}
          type="button"
          className="tp-product-details-action-sm-btn"
        >
          <WishlistTwo />
          Add Wishlist
        </button>
        <button type="button" className="tp-product-details-action-sm-btn">
          <AskQuestion />
          Ask a question
        </button>
      </div>
      {/* product-details-action-sm end */}
      {detailsBottom && (
        <DetailsBottomInfo category={category?.name} sku={sku} tag={tags[0]} />
      )}
      {/* Example of how to render popup */}
      {popupMessage && (
        <div
          className="popup"
          style={{
            position: "fixed",
            top: "10%",
            left: "0%",
            backgroundColor:
              "rgba(0, 0, 0, 0.5)" /* semi-transparent black background */,
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
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" /* subtle shadow */,
              textAlign: "center",
              maxWidth: "80%" /* Adjust max-width as needed */,
            }}
          >
            <p>{popupMessage}</p>
            <button
              style={{
                backgroundColor: "#007bff" /* blue color */,
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
    </div>
  );
};

export default DetailsWrapper;
