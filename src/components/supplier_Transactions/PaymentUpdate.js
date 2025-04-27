import React, { useEffect, useState } from "react";
import api from "../../api";
import { getAuthConfig } from "../../config/authConfig";

export default function PaymentUpdate({ isOpen, onClose, initialTransaction }) {

  const [totalBill, setTotalBill] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [supplierName, setSupplierName] = useState("");
  const [allPayments, setAllPayments] = useState([]);
  const [success, setSuccess] = useState(false);
  const [paymentUpdate, setPaymentUpdate] = useState({
    id: "",
    description: "",
    payment: "",
    date: "",
  });
  const [error, setErrors] = useState({ payment: null });

  const [transactionRowID, setTransactionRowID] = useState("");

  useEffect(() => {
    if (isOpen && initialTransaction) {
      let payment_update_data = initialTransaction.paymentUpdate || [];

      let payment_update=[]

      if (typeof payment_update_data === "string") {
         payment_update = JSON.parse(payment_update_data);
      } else {
        payment_update=payment_update_data
      }

      setAllPayments(payment_update);
      setTotalBill(initialTransaction.amount||0)

      let paidAmount = initialTransaction.paidAmount || 0;

      setPaidAmount(paidAmount);
      setRemainingAmount((initialTransaction?.amount || 0) - paidAmount);
      setSupplierName(initialTransaction.supplierName)
      
    }
  }, [isOpen, initialTransaction]);

  useEffect(() => {
    if (initialTransaction && initialTransaction.id) {
      setTransactionRowID(initialTransaction.id);
    }
  }, [initialTransaction, isOpen]);


  useEffect(() => {
    if (isOpen) {
      setPaymentUpdate({ description: "", payment: "" });
      setErrors({ payment: null });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let inputValue = value;


    if (name === "payment") {
      let numericValue = parseFloat(value);

      if (!isNaN(numericValue)) {
        if (numericValue > remainingAmount) {
          numericValue = remainingAmount;
        } else if (numericValue < 0) {
          numericValue = 0;
        }

        inputValue = numericValue.toString();
      }
    }

    const errorMessage = validateField(name, inputValue);

    setErrors((prevErrors) => ({...prevErrors,[name]: errorMessage,}));
    setPaymentUpdate((prev) => ({...prev,[name]: inputValue,}));
  };

  const validateField = (name, value) => {
    if (name === "payment") {
      return value === "" ||
        isNaN(value) ||
        parseFloat(value) <= 0 ||
        parseFloat(value) > remainingAmount
        ? "Add a valid amount"
        : null;
    }
    return null;
  };

  const showAlert = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleSave = async () => {
    // Validate payment field again before checking errors
    const errorMessage = validateField("payment", paymentUpdate.payment);

    // Update the error state
    setErrors((prevErrors) => ({ ...prevErrors,payment: errorMessage,}));

    if (errorMessage) {
      showAlert("Please fill the fields before submitting", "error");
      return;
    }

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure? You cannot make changes after saving."
    );
    if (!isConfirmed) return;

    // Prepare updated payment data
    const updatedPayment = {
      description: paymentUpdate.description,
      payment: parseFloat(paymentUpdate.payment),
    };

    console.log("Saving Payment Update:", updatedPayment);
    handleSavePaymentUpdate(transactionRowID, updatedPayment);
    onClose();
  };

  const handleSavePaymentUpdate = async (transactionRowID, paymentUpdate) => {
    try {
      const config = await getAuthConfig();
      
      const response = await api.post(
        `/supplierTransaction/paymentUpdate/${transactionRowID}`,
        paymentUpdate,
        config
      );

      if (response.data.success == true) {
        showAlert("Payment update added successfully", "success");


        setPaymentUpdate({
          description: "",
          payment: "",
        });
        setSuccess(true);

        setTimeout(() => {
          onClose(true); 

        }, 1500);

      } else {
        showAlert("Error while saving data", "success");
      }
    } catch (error) {
      console.log("Error while saving new payment", error);

      showAlert(
        `Cannot create this payment update: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    }
  };


  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ width: "85%" }}>
        <h1>Payment Updates</h1>
        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
        <div>
          <h3>Supplier</h3>
          <label>{supplierName || "Load supplier here"}</label>
        </div>

        <h3>Payment History</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Description</th>
              <th>Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {allPayments.length > 0 ? (
              allPayments.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.date ? entry.date.split("T")[0] : "-"}</td>
                  <td>{entry.description || "-"}</td>
                  <td>{entry.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No payment updates done
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h2 style={{ textAlign: "left" }}>Total Bill</h2>
        <input type="text" value={totalBill.toFixed(2)} readOnly />

        <h2 style={{ textAlign: "left" }}>Total Paid Amount</h2>
        <input type="text" value={paidAmount.toFixed(2)} readOnly />

        <h2 style={{ textAlign: "left" }}>Remaining Amount</h2>
        <input type="text" value={remainingAmount.toFixed(2)} readOnly />

        <h2 style={{ textAlign: "left" }}>Payment</h2>
        <input
          type="number"
          name="payment"
          value={paymentUpdate.payment}
          placeholder="Enter the amount you want to pay today"
          onChange={handleInputChange}
        />
        {error.payment && (
          <small style={{ color: "red" }}>{error.payment}</small>
        )}

        <h2 style={{ textAlign: "left" }}>Description</h2>
        <input
          type="text"
          name="description"
          placeholder="Enter payment description"
          value={paymentUpdate.description}
          onChange={handleInputChange}
        />

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              background: "green",
              color: "white",
            }}
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
}
