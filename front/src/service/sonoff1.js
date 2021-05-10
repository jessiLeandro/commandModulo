import api from "./api";
import { store } from "../store";

export const getStatus = async (ip) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/chip/sonoff", {
      headers,
      params: { ip },
    });

    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const getCommand = async (ip, command, value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.post(
      "/chip/sonoff",
      { ip, command, value },
      {
        headers,
      }
    );

    return response;
  } catch (err) {
    console.log("Erro: ", err);
  }
};
