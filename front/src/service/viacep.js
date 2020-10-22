import axios from "axios";

const url = cep => `https://viacep.com.br/ws/${cep}/json/`;

export const getAddressByZipCode = cep => {
  return axios.get(url(cep.replace(/\D+/g, "")));
};
