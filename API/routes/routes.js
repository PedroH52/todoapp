const express = require('express');
const router = express.Router();
module.exports = router;
const modeloTarefa = require('../models/tarefa');

// ROTA POST: Grava uma nova tarefa
router.post('/post', async (req, res) => {
    const objetoTarefa = new modeloTarefa({
        descricao: req.body.descricao,
        statusRealizada: req.body.statusRealizada
    });
    try {
        const tarefaSalva = await objetoTarefa.save();
        res.status(200).json(tarefaSalva);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ROTA GET: Obter todas as tarefas (getAll)
router.get('/getAll', async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ROTA DELETE: Elimina a tarefa identificada pelo id
router.delete('/delete/:id', async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
        res.json(resultado);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ROTA PATCH: Atualiza a tarefa identificada pelo id
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const novaTarefa = req.body;
        const options = { new: true };
        const result = await modeloTarefa.findByIdAndUpdate(
            id, novaTarefa, options
        );
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
