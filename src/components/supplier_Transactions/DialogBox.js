import api from "../../api";
import "../../styles/DialogBox.css";
import React, { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";

export default function DialogBox({
  isOpen,
  onClose,
  initialTransaction,
  transactionType,
})
 {
  const [quantity, setQuantity] = useState(1);
  const [allItems, setAllItems] = useState([]);
  const [message, setMessage] = useState("");
  const [selectItem, setSelectItem] = useState("");
  const [supplierOrder, setSupplierOrder] = useState([]);
  const [receivedOder, setReceivedOder] = useState([]);
  //uploading the paid amount
  const [editTransaction, setEditTransaction] = useState(null);
  const [discount, setDiscount] = useState(0);
  const { showAlert } = useAlert();

  const [editTransaction_BillTotal, setEditTransaction_BillTotal] = useState(0);
  const [editTransaction_Discount, setEditTransaction_Discount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [RemainingAmount, setRemainingAmount] = useState(0);

  const[receiveOrder_BillTotal,setReceiveOrder_BillTotal]=useState(0);
  const[receiveOrder_Discount,setReceiveOrder_Discount]=useState(0);


  // console.log("initialTransaction");
  // console.log(initialTransaction.SupplierOrder);

  const calRemainingAmount = () => {
    setRemainingAmount(
      (editTransaction_BillTotal - editTransaction_Discount || 0) - paidAmount
    );
  };

  useEffect(() => {
    calRemainingAmount();
  }, [paidAmount, editTransaction_BillTotal, editTransaction_Discount]);

  useEffect(() => {
    if (isOpen) {
      fetchAllItems();
      initialSupplierOrders();
      handleRecieveOder();
    }
  }, [isOpen]);

  const fetchAllItems = async () => {
    try {
      const response = await api.get("/items");
      setAllItems(response.data);
    } catch (error) {
      setMessage("Failed to load items");
    }
  };


  // display amount for transaction bill payments
  const initialSupplierOrders = () => {
    if (initialTransaction && initialTransaction.SupplierOrder) {
      try {
        
        const parsedOrder = initialTransaction;
        setEditTransaction_BillTotal(parsedOrder.amount);
        setEditTransaction_Discount(parsedOrder.discount);
        setPaidAmount(parsedOrder.paidAmount);
      } catch (error) {
        console.error("Error parsing SupplierOrder:", error);
        setSupplierOrder([]);
      }
    }
  };

  const handleAddToTable = () => {
    if (!selectItem) {
      showAlert("Please select a product", "ok");
      return;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      showAlert("Please insert a valid quantity", "ok");
      setQuantity(1);
      return;
    }

    const orderItem = allItems.find((item) => item.id === selectItem);
    if (!orderItem) {
      showAlert("Invalid item selection", "error");
      return;
    }

    setSupplierOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.itemId === selectItem);
      if (existingItem) {
        return prevOrder.map((item) =>
          item.itemId === selectItem
            ? { ...item, itemQnt: item.itemQnt + quantity }
            : item
        );
      } else {
        return [
          ...prevOrder,
          {
            itemId: orderItem.id,
            itemName: orderItem.name,
            itemQnt: quantity,
            unitPrice: orderItem.price || 0,
          },
        ];
      }
    });

    setSelectItem("");
    setQuantity(1);
  };

  const handleRemoveItem = (itemId) => {
    setSupplierOrder(supplierOrder.filter((item) => item.itemId !== itemId));
  };

  const billTotal = supplierOrder.reduce((total, order) => {
    return total + (order.unitPrice || 0) * order.itemQnt;
  }, 0);

  const createSupplierTransaction = async () => {
    try {
      const transactionData = {
        supplierId: initialTransaction.supplierId,
        items: supplierOrder,
        totalAmount: billTotal - discount,
      };
      await api.post("/transactions", transactionData);
      showAlert("Order placed successfully!", "success");
      onClose();
    } catch (error) {
      showAlert("Failed to place order", "error");
    }
  };

  const handleCreateTransaction = async () => {
    // Logic to handle creating a general transaction
    showAlert("Transaction created successfully!", "success");
    onClose();
  };


      
  const handleRecieveOder = () => {
    if (initialTransaction && initialTransaction.SupplierOrder) {
      console.log("initialTransaction.SupplierOrder:", initialTransaction.SupplierOrder);
      
     
      let RecivedOders = initialTransaction.SupplierOrder;
      
      // If SupplierOrder is a string (JSON string), parse it
      if (typeof RecivedOders === 'string') {
        try {
          RecivedOders = JSON.parse(RecivedOders);
        } catch (error) {
          console.error("Error parsing SupplierOrder JSON string:", error);
          return;
        }
      }
      
      if (Array.isArray(RecivedOders)) {
        console.log('Recieved Oder:', RecivedOders);
        
        try {
          console.log('come to try block');
          console.log(RecivedOders);
          console.log('===================');
  
          const initialReceivedOder = RecivedOders.map((order) => ({
            itemName: order.itemName,
            itemId: order.itemId,
            itemQnt: order.RequestedAmount,
            unitPrice: order.unitPrice,
            receivedQnt: order.AcceptedAmount,
          }));
  
          console.log('initialReceivedOder');
          console.log(initialReceivedOder);
  
          setReceivedOder(initialReceivedOder);
        } catch (error) {
          console.error("Error parsing SupplierOrder:", error);
          setReceivedOder([]);
        }
      } else {
        console.error("SupplierOrder is not an array, it is:", typeof RecivedOders);
        setReceivedOder([]);  // Or handle this case as necessary
      }
    }
  };
  

  const handleReceivedQuantityChange = (itemId, newQuantity) => {
    setReceivedOder((prevOrders) =>
      prevOrders.map((order) =>
        order.itemId === itemId ? { ...order, receivedQnt: newQuantity } : order
      )
    );
  };

  const updateRecievedOder = () => {
    // empty for now
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ width: "85%" }}>
        <h2>
          {transactionType === "Supplier Order"
            ? "Supplier Order"
            : transactionType}
        </h2>

        {/*============= content for suppplier oder==================== */}

        {transactionType === "Supplier_Order" && (
          <div>
            <div>
              <label>Supplier:</label>
              <input value={initialTransaction.supplierName} readOnly />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <label>Product:</label>
                <select
                  value={selectItem}
                  onChange={(e) => setSelectItem(e.target.value)}
                >
                  <option value="">--Add an item--</option>
                  {allItems.length > 0 ? (
                    allItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>--No items to load--</option>
                  )}
                </select>
              </div>

              <div style={{ margin: "10px" }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div>
                <button onClick={handleAddToTable}>Add to table</button>
              </div>
            </div>

            <div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Order Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierOrder.length > 0 ? (
                    supplierOrder.map((order, index) => (
                      <tr key={order.itemId}>
                        <td>{index + 1}</td>
                        <td>{order.itemName}</td>
                        <td>{order.itemQnt}</td>
                        <td>{order.unitPrice.toFixed(2)}</td>
                        <td>{(order.unitPrice * order.itemQnt).toFixed(2)}</td>
                        <td>
                          <button
                            onClick={() => handleRemoveItem(order.itemId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No items added</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <label>Bill Total:</label>
              <span> ${billTotal.toFixed(2)}</span>
            </div>
            <div>
              <label>Discount:</label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Total after Discount:</label>
              <input readOnly value={(billTotal - discount).toFixed(2)} />
            </div>
            <div>
              <button onClick={createSupplierTransaction}>Place Order</button>
            </div>
          </div>
        )}

        {/* ==========content for Recive oder================ */}
        {transactionType === "Receive_Order" && (
          <div>
            <p>Details for receiving order.</p>
            <div>
              <div>
                <label>Supplier:</label>
                <input value={initialTransaction.supplierName} readOnly />
              </div>

              <div>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Order Quantity</th>
                      <th>Unit Price</th>
                      <th>Recived Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivedOder.length > 0 ? (
                      receivedOder.map((order, index) => (
                        <tr key={order.itemId}>
                          <td>{index + 1}</td>
                          <td>{order.itemName}</td>
                          <td>{order.itemQnt}</td>
                          <td>{order.unitPrice.toFixed(2)}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={order.receivedQnt}
                              onChange={(e) =>
                                handleReceivedQuantityChange(
                                  order.itemId,
                                  Number(e.target.value)
                                )
                              }
                            />
                          </td>
                          <td>
                            {(order.unitPrice * order.receivedQnt).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No items received</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div>
                <label>Bill Total:</label>
                <span> ${billTotal.toFixed(2)}</span>
              </div>
              <div>
                <label>Discount:</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Total after Discount:</label>
                <input readOnly value={(billTotal - discount).toFixed(2)} />
              </div>
            </div>
            <button>Confirm Receipt</button>
          </div>
        )}
        {/* ============content for transactions========== */}
        {transactionType === "Edit_Transaction" && (
          <div>
            <p>General transaction details.</p>
            <div>
              <lable>Supplier:</lable>
              <input readOnly value={"suppplierName"} />
            </div>
            <div>
              <label>Bill Total</label>
              <input readOnly value={editTransaction_BillTotal} />
            </div>
            <div>
              <label>Discount</label>
              <input readOnly value={editTransaction_Discount} />
            </div>
            <div>
              <label>Total After Discount</label>
              <input
                readOnly
                value={
                  editTransaction_BillTotal - editTransaction_Discount || 0
                }
              />
            </div>
            <div>
              <label>Paid Amount</label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Remaining Amount</label>
              <input readOnly value={RemainingAmount} />
            </div>

            <button onClick={handleCreateTransaction}>
              Create Transaction
            </button>
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
