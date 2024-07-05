import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useCartInfo = () => {
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalWithDiscount, setTotalWithDiscount] = useState(0);
  const { cart_products } = useSelector((state) => state.cart);

  useEffect(() => {
    const cart = cart_products.reduce(
      (cartTotal, cartItem) => {
        const { price, orderQuantity, selectedVariant, discount } = cartItem;
        const variantPrice = selectedVariant
          ? selectedVariant.finalPrice
          : price;
        const discountedPrice =
          discount > 0
            ? variantPrice - (variantPrice * discount) / 100
            : variantPrice;

        const itemTotal = variantPrice * orderQuantity;
        const itemTotalWithDiscount = discountedPrice * orderQuantity;

        cartTotal.total += itemTotal;
        cartTotal.totalWithDiscount += itemTotalWithDiscount;
        cartTotal.quantity += orderQuantity;

        return cartTotal;
      },
      {
        total: 0,
        totalWithDiscount: 0,
        quantity: 0,
      }
    );

    setQuantity(cart.quantity);
    setTotal(cart.total);
    setTotalWithDiscount(cart.totalWithDiscount);
  }, [cart_products]);

  return {
    quantity,
    total,
    totalWithDiscount,
  };
};

export default useCartInfo;
