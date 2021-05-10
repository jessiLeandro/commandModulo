const database = require("../../database");
const Chip = database.model("chip");
const chipDomain = require("../../Domain/Chip");
const R = require("ramda");

class SonoffController {
  async get(req, res, next) {
    const transaction = await database.transaction();

    // console.log(req)
    console.log(req.query)

    try {
      const chip = await chipDomain.create(req.query, { transaction });

      await transaction.commit();
      res.json(chip);
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }

  async postStatus(req, res, next) {
    const transaction = await database.transaction();

    try {
      const { body } = req;

      const chip = await Chip.findOne({
        where: { numeroModulo: body.numeroModulo },
        transaction,
      });
      await chip.update({
        tempoLigado_ms: chip.tempoLigado_ms + body.tempoLigado,
        tempoSemConexao_ms: chip.tempoSemConexao_ms + body.tempoSemConexao,
        equipamentoLigado: !!body.relogioLigado,
        moduloLigado: !!body.moduloLigado,
        contadorModuloResetado:
          chip.contadorModuloResetado + body.contadorModuloResetado,
        maiorTempoSemConexao: R.max(
          body.tempoSemConexao,
          chip.maiorTempoSemConexao
        ),
      });

      await transaction.commit();
      res.json();
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = new SonoffController();
