const Sequelize = require("sequelize");
const R = require("ramda");

module.exports = (sequelize, DataTypes) => {
  const chip = sequelize.define("chip", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    numeroModulo: {
      type: Sequelize.STRING,
      allowNull: false,
      set(oldValue) {
        const newValue = R.trim(oldValue);
        this.setDataValue("numeroModulo", newValue);
      },
    },

    sonoffDoisRele: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },

    ip: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isIP: true,
      },
      set(oldValue) {
        const newValue = R.trim(oldValue);
        this.setDataValue("ip", newValue);
      },
    },

    razaoSocial: {
      type: Sequelize.STRING,
      allowNull: true,
      set(oldValue) {
        const newValue = R.trim(oldValue);
        this.setDataValue("razaoSocial", newValue);
      },
    },

    logradouro: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    bairro: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    cep: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^\d{5}-\d{3}$/i,
      },
    },

    cidade: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    uf: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^[A-Z]+$/i,
        len: [2, 2],
      },
    },

    complemento: {
      type: Sequelize.STRING,
    },

    numero: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isInt: true,
      },
    },

    tempoParaTestar: {
      type: Sequelize.INTEGER,
      defaultValue: 300000,
      validate: {
        min: 300000,
        max: 1800000,
      },
    },

    tempoDeTeste: {
      type: Sequelize.INTEGER,
      defaultValue: 300000,
      validate: {
        min: 300000,
        max: 1800000,
      },
    },

    tempoLigado_ms: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },

    tempoDesligado_ms: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },

    tempoSemConexao_ms: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },

    maiorTempoSemConexao: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },

    contadorSonoffLigado: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },

    contadorModuloResetado: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    equipamentoLigado: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },

    moduloLigado: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return chip;
};
