import * as R from "ramda";

const limitValue = (array, index) => {
  return R.min(parseInt(array[index], 10), 255);
};

export const mascara = (name, value, oldValue) => {
  let valor = value;
  switch (name) {
    case "ip":
      valor = valor.replace(/[^\d | .]/gi, "");
      valor = valor.slice(0, 15);

      if (valor[0] === ".") return { name, valor: "" };

      const valorArray = valor.split(".");

      if (valorArray.length === 1 && valorArray[0].length >= 3) {
        if (oldValue[oldValue.length - 1] === ".") {
          valor = limitValue(valorArray, 0);
        } else {
          valor = limitValue(valorArray, 0) + ".";
        }
      }

      if (valorArray.length === 2 && valorArray[1].length >= 3) {
        if (oldValue[oldValue.length - 1] === ".") {
          valor = limitValue(valorArray, 0) + "." + limitValue(valorArray, 1);
        } else {
          valor =
            limitValue(valorArray, 0) + "." + limitValue(valorArray, 1) + ".";
        }
      }

      if (valorArray.length === 3 && valorArray[2].length >= 3) {
        if (oldValue[oldValue.length - 1] === ".") {
          valor =
            limitValue(valorArray, 0) +
            "." +
            limitValue(valorArray, 1) +
            "." +
            limitValue(valorArray, 2);
        } else {
          valor =
            limitValue(valorArray, 0) +
            "." +
            limitValue(valorArray, 1) +
            "." +
            limitValue(valorArray, 2) +
            ".";
        }
      }

      if (valorArray.length >= 4 && valorArray[3].length > 0) {
        valor =
          limitValue(valorArray, 0) +
          "." +
          limitValue(valorArray, 1) +
          "." +
          limitValue(valorArray, 2) +
          "." +
          limitValue(valorArray, 3);
      }

      // if (length < 3) {
      //   valor = valorArray[0] + ".";
      // }
      // if (length >= 3 && length <= 6) {
      //   valor = valorArray[0] + "." + valorArray[1];
      // }
      // if (length > 6 && length <= 9) {
      // }

      // valor = valor.replace(/\D/gi, "");

      // if (length > 3 && length <= 6) {
      //   valor = valor.replace(/(\d{3})(\d{3})?/, "$1.$2");
      // }
      // if (length > 6 && length <= 9) {
      //   valor = valor.replace(/(\d{3})(\d{3})(\d{3})?/, "$1.$2.$3");
      // }
      // if (length > 9 && length <= 12) {
      //   valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{3})?/, "$1.$2.$3.$4");
      // }

      return { name, valor };

    case "cep":
      valor = valor.replace(/\D/gi, "");
      valor = valor.slice(0, 8);

      if (valor.length > 5) valor = valor.replace(/(\d{5})(\d{1,3})/, "$1-$2");

      return { name, valor };

    case "uf":
      valor = valor.replace(/\W|\d/g, "");
      valor = valor.slice(0, 2);
      valor = valor.toUpperCase();

      return { name, valor };

    case "logradouro":
    case "cidade":
      valor = valor.slice(0, 40);

      return { name, valor };

    case "bairro":
      valor = valor.slice(0, 30);

      return { name, valor };

    case "complemento":
      valor = valor.slice(0, 20);

      return { name, valor };
    default:
      return { name, valor };
  }
};
