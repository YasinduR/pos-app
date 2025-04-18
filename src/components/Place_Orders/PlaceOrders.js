import Header from "../Header/Header";
import api from "../../api";
import { useAlert } from "../../context/AlertContext";
import { useState, useEffect } from "react";
import { getAuthConfig } from "../../config/authConfig";
import { config } from "dotenv";


export default function PlaceOrders() {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [supplierOrder, setSupplierOrder] = useState([]);
  const billTotal = supplierOrder.reduce(
    (total, order) => total + (order.price || 0) * order.quantity,
    0
  );
  const [customBillTotal, setCustomBillTotal] = useState(billTotal);
  const { showAlert } = useAlert();
  // const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
  }, []);

  useEffect(() => {
    setCustomBillTotal(billTotal);
  }, [billTotal]);

  async function fetchSuppliers() {
    try {
      const config = await getAuthConfig();
      const response = await api.get("/allSuppliers",config);
      setSuppliers(response.data);
    } catch (error) {
      setMessage("Failed to load suppliers");
    }
  }

  async function fetchItems() {
    try {
      const response = await api.get("/items");
      setItems(response.data);
    } catch (error) {
      setMessage("Failed to load items");
    }
  }

  const handleAddToTable = () => {
    if (!selectedItem) {
      showAlert("Please select a product", "ok");
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      showAlert("Please insert a valid quantity", "ok");
      setQuantity(1);
      return;
    }

    const item = items.find((item) => item.id === selectedItem);

    setSupplierOrder((prevOrder) => {
      const orderItem = prevOrder.find((item) => item.id === selectedItem);
      if (orderItem) {
        return prevOrder.map((item) =>
          item.id === selectedItem ? { ...item, quantity: quantity } : item
        );
      } else {
        return [...prevOrder, { ...item, quantity }];
      }
    });

    setQuantity(1);
  };

  // Calculate total bill


  const createSupplierTransaction = async () => {
    
    if (!selectedSupplier) {
      showAlert("Please select a supplier to process the request");
      return;
    }

    try {

      const config = await getAuthConfig();

      const supplierTransaction = {
        supplierId: selectedSupplier,
        amount: customBillTotal,
        discount: 0,
        type: "POD",
        SupplierOrder: supplierOrder.map((item) => ({
          itemId: item.id,
          RequestedAmount: item.quantity,
          AcceptedAmount: 0
        })),
        paidAmount: 0,
      };

      console.log(supplierTransaction);

      const response = await api.post(
        "/supplierTransaction",
        supplierTransaction,config
      );

   
      

      if (response.data.success) {
        showAlert("Order for the supplier created successfully");

        setSupplierOrder([]);
        setSelectedItem(null);
        setQuantity(1);
        // setDiscount(0);
      } else {
        showAlert(
          `Error while creating the supplier Oder, ${response.data.message}`
        );
      }
    } catch (error) {
      showAlert("Failed to process supplier transaction. Please try again.");
    }
  };

  return (
    <div>
      <Header headtext="Place Order" />

      <label>Supplier:</label>
      <select
        value={selectedSupplier || "null"}
        onChange={(e) =>
          setSelectedSupplier(e.target.value === "null" ? null : e.target.value)
        }
      >
        <option value="null">--select a supplier--</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>

      <div>
        <label>Product:</label>
        <select
          value={selectedItem || "null"}
          onChange={(e) =>
            setSelectedItem(e.target.value === "null" ? null : e.target.value)
          }
        >
          <option value="null">--select a product--</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <label>Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button onClick={handleAddToTable}>Add</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>In stock</th>
              <th>Order Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {supplierOrder.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.name}</td>
                <td>{order.stock}</td>
                <td>{order.quantity}</td>
                <td>{order.price || 0}</td>
                <td>{(order.price || 0) * order.quantity}</td>
                <td>
                  <button
                    onClick={() =>
                      setSupplierOrder(
                        supplierOrder.filter((item) => item.id !== order.id)
                      )
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
  <label>Total value of stock:</label>
  <span>
    {billTotal}
  </span>
</div>
        {/* <div>
          <label>Discount:</label>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => {
              const inputDiscount = Number(e.target.value);
              if (inputDiscount > customBillTotal) {
                showAlert("Discount cannot exceed the total bill", "ok");
                setDiscount(customBillTotal);
              } else {
                setDiscount(inputDiscount);
              }
            }}
          />
        </div> */}
        <div>
  <label>Bill total :</label>
        <input
       type="number"
    min="0"
    value={customBillTotal}
    onChange={(e) => setCustomBillTotal(Number(e.target.value))}
  />
</div>
        <div>
          <button onClick={createSupplierTransaction}>Place the Order</button>
        </div>
      </div>
    </div>
  );
}
