const express = require('express');
const router = express.Router();
const controller = require("./controller");

router.post('/project', controller.addProject);
router.patch('/project/:id', controller.editProject);
router.delete('/project/:id', controller.deleteProject);
router.get('/project/:id', controller.getProject);
router.get('/projectList', controller.listProjects);

router.post('/question/:pid', controller.addQuestion);
router.patch('/question/:pid/:id', controller.editQuestion);
router.delete('/question/:pid/:id', controller.removeQuestion);
router.get('/question/:pid/:id', controller.getQuestion);

router.post('/label/:pid', controller.addLabel);
router.patch('/label/:pid/:id', controller.editLabel);
router.delete('/label/:pid/:id', controller.removeLabel);
router.get('/label/:pid/:id', controller.getLabel);

router.put('/questionLabel/:qid/:lid', controller.addLabelToQuestion);
router.delete('/questionLabel/:qid/:lid', controller.removeLabelFromQuestion);
router.put('/answerLabel/:aid/:lid', controller.addLabelToAnswer);
router.delete('/answerLabel/:aid/:lid', controller.removeLabelFromAnswer);

router.post('/variation/:pid', controller.addVariation);
router.patch('/variation/:pid/:id', controller.editVariation);
router.delete('/variation/:pid/:id', controller.removeVariation);
router.get('/variation/:pid/:id', controller.getVariation);

router.put('/variationAnswer/:aid/:vid', controller.addAnswerIntoVariation);
router.delete('/variationAnswer/:aid/:vid', controller.removeAnswerFromVariation);

router.post('/answer/:pid/:qid', controller.addAnswer);
router.patch('/answer/:pid/:qid/:id', controller.editAnswer);
router.delete('/answer/:pid/:qid/:id', controller.removeAnswer);
router.get('/answer/:pid/:qid/:id', controller.getAnswer);


module.exports = router;