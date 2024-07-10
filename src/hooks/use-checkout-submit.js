import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
// Internal imports
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  useCreatePaymentIntentMutation,
  useSaveOrderMutation,
} from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";

const useCheckoutSubmit = () => {
  // Redux hooks and queries
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  const [saveOrder] = useSaveOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const { cart_products } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { shipping_info } = useSelector((state) => state.order);
  const { total, totalWithDiscount, setTotal } = useCartInfo();

  // Local state variables
  const [couponInfo, setCouponInfo] = useState({});
  const [cartTotal, setCartTotal] = useState("");
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountProductType, setDiscountProductType] = useState("");
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [couponApplyMsg, setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  let couponRef = useRef("");

  useEffect(() => {
    // Load coupon info from localStorage if available
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    // Reset discount percentage if minimum amount is not met
    if (
      minimumAmount - discountAmount > (totalWithDiscount || total) ||
      cart_products.length === 0
    ) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, totalWithDiscount, total, discountAmount, cart_products]);

  useEffect(() => {
    // Calculate total and discount values
    const result = cart_products?.filter(
      (p) => p.productType === discountProductType
    );
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) =>
        preValue + currentValue.price * currentValue.orderQuantity,
      0
    );
    let totalValue = "";
    let subTotal = Number(
      ((totalWithDiscount || total) + shippingCost).toFixed(2)
    );
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    totalWithDiscount,
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
    discountAmount,
    cartTotal,
  ]);

  useEffect(() => {
    // Create payment intent
    if (cartTotal) {
      createPaymentIntent({ price: parseInt(cartTotal) })
        .then((data) => {
          setClientSecret(data?.data?.clientSecret);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [createPaymentIntent, cartTotal]);

  // Handle coupon code submission
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if ((totalWithDiscount || total) < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`
      );
      return;
    } else {
      setCouponApplyMsg(
        `Your Coupon ${result[0].title} is Applied on ${result[0].productType} productType!`
      );
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      dispatch(set_coupon(result[0]));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("");
      }, 5000);
    }
  };

  // Handle shipping cost update
  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  useEffect(() => {
    // Set form values with shipping info
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("country", shipping_info.country);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("zipCode", shipping_info.zipCode);
    setValue("contactNo", shipping_info.contactNo);
    setValue("email", shipping_info.email);
    setValue("orderNote", shipping_info.orderNote);
  }, [user, setValue, shipping_info, router]);

  // Function to generate an array of warranty IDs
  const generateWarrantyIds = (quantity) => {
    const warrantyIds = [];
    for (let i = 0; i < quantity; i++) {
      warrantyIds.push(uuidv4());
    }
    return warrantyIds;
  };

  // Generate warranty information
  const generateWarrantyInformation = (orderInfo, item, warrantyId) => {
    const dateOfPurchase = dayjs().format("DD/MM/YYYY");
    const warrantyPeriod = item.selectedVariant
      ? item.selectedVariant.variantWarrantyPeriod
      : item.warrantyPeriod;
    const warrantyEndDate = dayjs()
      .add(warrantyPeriod, "day")
      .format("DD/MM/YYYY");

    return {
      warrantyId,
      customerName: orderInfo.name,
      dateOfPurchase,
      warrantyPeriod: `From ${dateOfPurchase} to ${warrantyEndDate}`,
    };
  };

  // Generate product certificate information
  const generateProductCertificateInformation = (warrantyId) => {
    return {
      certificateId: warrantyId,
      certificateUrl: "The product hasn't been updated with a certificate yet",
    };
  };

  // Handle form submission
  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setIsCheckoutSubmit(true);

    // Generate warranty IDs for each product
    const cartWithWarranties = cart_products.map((product) => ({
      ...product,
      warrantyIds: generateWarrantyIds(product.orderQuantity),
    }));

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "new",
      cart: cartWithWarranties,
      paymentMethod: data.payment,
      subTotal: totalWithDiscount || total,
      shippingCost: shippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      orderNote: data.orderNote,
      user: `${user?._id}`,
    };

    // Add warranty and certificate information
    cartWithWarranties.forEach((item) => {
      item.warrantyIds.forEach((warrantyId) => {
        item.warrantyInformation = item.warrantyInformation || [];
        item.productCertificateInformation =
          item.productCertificateInformation || [];
        item.warrantyInformation.push(
          generateWarrantyInformation(orderInfo, item, warrantyId)
        );
        item.productCertificateInformation.push(
          generateProductCertificateInformation(warrantyId)
        );
      });
    });

    if (data.payment === "Card") {
      if (!stripe || !elements) {
        return;
      }
      const card = elements.getElement(CardElement);
      if (card == null) {
        return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
      });
      if (error && !paymentMethod) {
        setCardError(error.message);
        setIsCheckoutSubmit(false);
      } else {
        setCardError("");
        const orderData = { ...orderInfo, cardInfo: paymentMethod };
        return handlePaymentWithStripe(orderData);
      }
    }
    if (data.payment === "COD") {
      saveOrder({ ...orderInfo }).then((res) => {
        if (res?.error) {
        } else {
          localStorage.removeItem("cart_products");
          localStorage.removeItem("couponInfo");
          setIsCheckoutSubmit(false);
          notifySuccess("Your Order Confirmed!");
          router.push(`/order/${res.data?.order?._id}`);
        }
      });
    }
  };

  // Handle payment with Stripe
  const handlePaymentWithStripe = async (order) => {
    try {
      const { paymentIntent, error: intentErr } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.firstName,
              email: user?.email,
            },
          },
        });
      if (intentErr) {
        notifyError(intentErr.message);
      } else {
        // notifySuccess("Your payment processed successfully");
      }

      const orderData = { ...order, paymentIntent };
      saveOrder({ ...orderData }).then((result) => {
        if (result?.error) {
        } else {
          localStorage.removeItem("couponInfo");
          notifySuccess("Your Order Confirmed!");
          router.push(`/order/${result.data?.order?._id}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleSubmit,
    submitHandler,
    register,
    errors,
    handleCouponCode,
    handleShippingCost,
    couponRef,
    cartTotal,
    discountAmount,
    discountPercentage,
    couponApplyMsg,
    isCheckoutSubmit,
    cardError,
    total: totalWithDiscount || total,
    shippingCost,
    discountProductType,
    setTotal,
    cardError,
    stripe,
    clientSecret,
    setClientSecret,
    showCard,
    setShowCard,
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total: totalWithDiscount || total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    cardError,
    submitHandler,
    stripe,
    handleSubmit,
    clientSecret,
    setClientSecret,
    cartTotal,
    isCheckoutSubmit,
    couponApplyMsg,
    showCard,
    setShowCard,
    handleCouponCode,
    handleShippingCost,
    submitHandler,
    couponRef,
    cartTotal,
    discountAmount,
    discountPercentage,
    couponApplyMsg,
    isCheckoutSubmit,
    cardError,
  };
};

export default useCheckoutSubmit;
