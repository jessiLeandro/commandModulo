import api from "./api";

export const login = async (value) => {
  try {
    return await api.post("/sessions", value);
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Erro: ", err);
    }
  }
};
