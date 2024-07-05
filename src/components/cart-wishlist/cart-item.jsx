import React, { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import Link from "next/link";
// internal
import { Close, Minus, Plus, ArrowDown, ArrowUp } from "@/svg";
import {
  add_cart_product,
  quantityDecrement,
  remove_product,
} from "@/redux/features/cartSlice";

const CartItem = ({ product }) => {
  const {
    _id,
    img,
    title,
    price,
    orderQuantity = 0,
    selectedVariant,
    discount,
  } = product || {};
  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  // handle decrement product
  const handleDecrement = (prd) => {
    dispatch(quantityDecrement(prd));
  };

  // handle remove product
  const handleRemovePrd = (prd) => {
    dispatch(remove_product(prd));
  };

  // toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <tr>
        {/* img */}
        <td className="tp-cart-img">
          <Link href={`/product-details/${_id}`}>
            <Image src={img} alt="product img" width={70} height={100} />
          </Link>
        </td>
        {/* title */}
        <td className="tp-cart-title">
          <Link href={`/product-details/${_id}`}>{title}</Link>
          <span onClick={toggleExpand} className="tp-cart-expand">
            {isExpanded ? <ArrowUp /> : <ArrowDown />}
          </span>
        </td>
        {/* price */}
        <td className="tp-cart-price">
          <span>
            {selectedVariant ? (
              discount > 0 ? (
                <>
                  <span className="tp-product-details-price old-price">
                    ${selectedVariant.finalPrice}
                  </span>
                  <span className="tp-product-details-price new-price">
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
              )
            ) : (
              <span className="tp-product-details-price new-price">
                ${price.toFixed(2)}
              </span>
            )}
          </span>
        </td>
        {/* quantity */}
        <td className="tp-cart-quantity">
          <div className="tp-product-quantity mt-10 mb-10">
            <span
              onClick={() => handleDecrement(product)}
              className="tp-cart-minus"
            >
              <Minus />
            </span>
            <input
              className="tp-cart-input"
              type="text"
              value={orderQuantity}
              readOnly
            />
            <span
              onClick={() => handleAddProduct(product)}
              className="tp-cart-plus"
            >
              <Plus />
            </span>
          </div>
        </td>
        {/* action */}
        <td className="tp-cart-action">
          <button
            onClick={() => handleRemovePrd({ title, id: _id })}
            className="tp-cart-action-btn"
          >
            <Close />
            <span> Remove</span>
          </button>
        </td>
      </tr>
      {isExpanded && selectedVariant && (
        <tr className="tp-cart-variant-details">
          <td colSpan="5">
            <div className="tp-cart-variant-info">
              {/* Display selected variant details */}
              <p>Selected Variant Details:</p>
              <ul>
                {selectedVariant.productVariantAttributes.map((attr, index) => (
                  <li key={index}>
                    {attr.type}:{" "}
                    {attr.set.set_values
                      .map((value) => `${value.key}: ${value.value}`)
                      .join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default CartItem;
