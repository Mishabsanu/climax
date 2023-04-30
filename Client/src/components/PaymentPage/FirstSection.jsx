import React from "react";
import styles from "../../components/Styling/PaymentsPage.module.scss";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function FirstSection({ handlePayment }) {
  const stripe = useStripe();
  const elements = useElements();
  const handlePaymentGateway = async () => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        handlePayment(id);
      } catch (error) {}
    } else {
    }
  };
  return (
    <div>
      <div className={styles.contact} style={{ borderRadius: "50px" }}>
        <div>More Payment options</div>
        <div className={styles.StoredCard}>
          <div className={styles.sidebar}>
            <div style={{ background: "white" }}>Credit / Debit card</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div style={{ paddingLeft: "100px" }} className={styles.cardDetails}>
            <span>Enter your card details</span>
            <div className={styles.sampleCard}>
              <div style={{ fontSize: "13px", color: "gray" }}>Card Number</div>
              <CardElement />
              <div className={styles.otherDetails}></div>
            </div>
            <div className={styles.payment}>
              <button onClick={handlePaymentGateway}>Make Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstSection;
