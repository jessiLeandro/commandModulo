const database = require("../../database");
const chipDomain = require("../../Domain/Chip");
const axios = require("axios");
const Chip = database.model("chip");
axios.defaults.timeout = 10000;

class ChipController {
  async update(req, res, next) {
    const transaction = await database.transaction();

    try {
      const chip = await chipDomain.update(req.body, { transaction });

      await transaction.commit();
      res.json(chip);
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }

  async getAll(req, res, next) {
    const transaction = await database.transaction();
    try {
      const { query } = req;
      const chips = await chipDomain.getAll({ transaction, query });
      await transaction.commit();
      res.json(chips);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  async getStatus(req, res, next) {
    const transaction = await database.transaction();
    const { query } = req;

    const chip = await Chip.findOne({ where: { ip: query.ip }, transaction });

    if (!chip) {
      return res.status(422);
    }

    const sonoff = axios.create({
      baseURL: `http://${query.ip}:4560`,
    });

    await sonoff
      .get("/?status=1")
      .then(async (resp) => {
        const { tempoLigado_ms } = chip;
        const chipUpdated = await chip.update(
          {
            tempoLigado_ms: tempoLigado_ms + resp.data.tempoLigado,
            equipamentoLigado: !!resp.data.relogioLigado,
            moduloLigado: !!resp.data.moduloLigado,
          },
          { transaction }
        );

        await transaction.commit();

        return res.status(200).json({
          ...chipUpdated,
          tempoLigado_ms: tempoLigado_ms + resp.data.tempoLigado,
          equipamentoLigado: !!resp.data.relogioLigado,
          moduloLigado: !!resp.data.moduloLigado,
          equipamentoLigado: chipUpdated.equipamentoLigado,
          moduloLigado: chipUpdated.moduloLigado,
        });
      })
      .catch((err) => {
        return res.status(408).json({
          ...chip,
          equipamentoLigado: chip.equipamentoLigado,
          moduloLigado: chip.moduloLigado,
        });
      });
  }

  async postCommand(req, res, next) {
    const transaction = await database.transaction();

    try {
      const { body } = req;

      const sonoff = axios.create({
        baseURL: `http://${body.ip}:4560`,
      });

      const status = await sonoff.get(`/?${body.command}=${body.value}`);

      const chip = await Chip.findOne({ where: { ip: body.ip }, transaction });

      if (
        body.command === "tempoDeTeste" ||
        body.command === "tempoParaTestar"
      ) {
        await chip.update({ [body.command]: body.value }, { transaction });
      }

      await transaction.commit();
      res.json(status.data);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = new ChipController();
