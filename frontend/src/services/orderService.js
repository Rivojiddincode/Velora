import api from "../api/axios";

export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const { data } = await api.put(`/orders/${id}/payment-status`, { paymentStatus });
  return data;
};

export const createPayment = async (orderId, gateway) => {
  const { data } = await api.post("/payments/create", { orderId, gateway });
  return data;
};