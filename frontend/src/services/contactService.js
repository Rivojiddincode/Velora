import api from "../api/axios";

export const sendContactMessage = async (formData) => {
  const { data } = await api.post("/contact", formData);
  return data;
};
