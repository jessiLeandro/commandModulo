const Sequelize = require("sequelize");
const { Op: operators } = Sequelize;
const bcrypt = require("bcryptjs");

const database = require("../../database");
const Chip = database.model("chip");
const R = require("ramda");
const { FieldValidationError } = require("../../helpers/errors");
const formatQuery = require("../../helpers/lazyLoad");
const chip = require("../../database/models/chip");

class ChipDomain {
  async create(body, options = {}) {
    const { transaction = null } = options;

    const chip = R.omit(
      [
        "ip",
        "tempoParaTestar",
        "tempoDeTeste",
        "id",
        "razaoSocial",
        "logradouro",
        "bairro",
        "cep",
        "cidade",
        "uf",
        "complemento",
        "numero",
      ],
      body
    );

    let error = false;

    const fielError = {
        numeroModulo: false,
      },
      message = {
        numeroModulo: "",
      };

    const chipNotHasProp = (prop) => R.not(R.has(prop, chip));

    if (chipNotHasProp("secretKey") && !chip.secretKey) {
      fielError.secretKey = true;
      message.secretKey = "secretKey cannot null";
      error = true;
    } else if (
      !(await bcrypt.compare(process.env.SECRET_KEY, chip.secretKey))
    ) {
      fielError.secretKey = true;
      message.secretKey = "secretKey INVALID";
      error = true;
    }

    if (chipNotHasProp("numeroModulo") || !chip.numeroModulo) {
      fielError.numeroModulo = true;
      message.numeroModulo = "numeroModulo cannot null";
      error = true;
    }

    if (chipNotHasProp("sonoffDoisRele") || !chip.sonoffDoisRele) {
      fielError.sonoffDoisRele = true;
      message.sonoffDoisRele = "sonoffDoisRele cannot null";
      error = true;
    }

    if (error) {
      throw new FieldValidationError([{ fielError, message }]);
    }

    const chipFind = await Chip.findOne({
      where: { numeroModulo: chip.numeroModulo },
      transaction,
    });

    if (chipFind) {
      await chipFind.update(
        {
          contadorSonoffLigado: chipFind.contadorSonoffLigado + 1,
          tempoDesligado_ms:
            chipFind.tempoDesligado_ms + (new Date() - chipFind.updatedAt),
        },
        { transaction }
      );
      return chipFind;
    }

    return await Chip.create(
      { numeroModulo: chip.numeroModulo, sonoffDoisRele: chip.sonoffDoisRele },
      { transaction }
    );
  }

  async update(body, options = {}) {
    const { transaction = null } = options;

    const chip = R.omit(["tempoParaTestar", "tempoDeTeste", "id"], body);

    let error = false;

    const fielError = {
        id: false,
        ip: false,
        razaoSocial: false,
        logradouro: false,
        bairro: false,
        cep: false,
        cidade: false,
        uf: false,
        complemento: false,
        numero: false,
      },
      message = {
        id: "",
        ip: "",
        razaoSocial: "",
        logradouro: "",
        bairro: "",
        cep: "",
        cidade: "",
        uf: "",
        complemento: "",
        numero: "",
      };

    const chipNotHasProp = (prop) => R.not(R.has(prop, chip));

    if (R.not(R.has("id", body)) || !body.id) {
      fielError.id = true;
      message.id = "id cannot null";
      throw new FieldValidationError([{ fielError, message }]);
    }

    const oldChip = await Chip.findByPk(body.id, { transaction });

    if (chipNotHasProp("ip") || !chip.ip) {
      fielError.ip = true;
      message.ip = "ip cannot null";
      error = true;
    } else {
      const ipArray = chip.ip.split(".");
      let ip = "";

      ipArray.map(
        (ipFrag, idx) =>
          (ip = ip + parseInt(ipFrag).toString() + (idx < 3 ? "." : ""))
      );

      if (
        (await Chip.findOne({ where: { ip }, transaction })) &&
        ip !== oldChip.ip
      ) {
        fielError.ip = true;
        message.ip = "ip already registered";
        error = true;
      }

      chip.ip = ip;
    }

    if (chipNotHasProp("razaoSocial") || !chip.razaoSocial) {
      fielError.razaoSocial = true;
      message.razaoSocial = "razaoSocial cannot null";
      error = true;
    }
    if (chipNotHasProp("logradouro") || !chip.logradouro) {
      fielError.logradouro = true;
      message.logradouro = "logradouro cannot null";
      error = true;
    }
    if (chipNotHasProp("bairro") || !chip.bairro) {
      fielError.bairro = true;
      message.bairro = "bairro cannot null";
      error = true;
    }
    if (chipNotHasProp("cep") || !chip.cep) {
      fielError.cep = true;
      message.cep = "cep cannot null";
      error = true;
    }
    if (chipNotHasProp("cidade") || !chip.cidade) {
      fielError.cidade = true;
      message.cidade = "cidade cannot null";
      error = true;
    }
    if (chipNotHasProp("uf") || !chip.uf) {
      fielError.uf = true;
      message.uf = "uf cannot null";
      error = true;
    }
    if (chipNotHasProp("complemento")) {
      fielError.complemento = true;
      message.complemento = "complemento cannot null";
      error = true;
    }
    if (chipNotHasProp("numero") || !chip.numero) {
      fielError.numero = true;
      message.numero = "numero cannot null";
      error = true;
    }

    if (error) {
      throw new FieldValidationError([{ fielError, message }]);
    }

    return await oldChip.update(chip, { transaction });
  }

  async getAll(options = {}) {
    const { query = {}, transaction = null } = options;

    const newQuery = Object.assign({}, query);
    const chipsExclude = R.propOr([], "chipsExclude")(newQuery);

    const { getWhere, limit, offset, pageResponse } = formatQuery(newQuery);

    const chips = await Chip.findAndCountAll({
      where: {
        ...getWhere("chip"),
        id: {
          [operators.and]: chipsExclude.map((id) => {
            return { [operators.ne]: parseInt(id, 10) };
          }),
        },
      },
      limit,
      offset,
      transaction,
    });

    const response = {
      ...chips,
      show: R.min(parseInt(limit), chips.count),
      page: parseInt(pageResponse),
    };

    return response;
  }
}

module.exports = new ChipDomain();
