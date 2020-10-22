"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const chip = queryInterface.createTable("chip", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      numeroModulo: {
        type: Sequelize.STRING,
        allowNull: false,
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
      },

      razaoSocial: {
        type: Sequelize.STRING,
        allowNull: true,
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
      },

      cidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      uf: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      complemento: {
        type: Sequelize.STRING,
      },

      numero: {
        type: Sequelize.STRING,
        allowNull: true,
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

      contadorSonoffLigado: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      contadorModuloResetado: {
        type: Sequelize.INTEGER,
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

      equipamentoLigado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      moduloLigado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      createdAt: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },

      updatedAt: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },

      deletedAt: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
    });

    return chip;
  },

  down: (queryInterface) => queryInterface.dropTable("chip"),
};
