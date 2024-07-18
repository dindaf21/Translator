const { middleware } = require("../db/middleware/middlewareGenerator");
const { LocalizationController } = require("../controller/localizationController");

const router = require("express").Router();

router
  .route("")
  .post(LocalizationController.createLocalization)
  // .get(middleware(["1", "2"]), LocalizationController.getAllLocalization);
  .get(LocalizationController.getAllLocalization);

  router.post('/bahasa', LocalizationController.addBahasa);
  router.get('/bahasa', LocalizationController.getAllBahasa);
  
router
  .route("/:id")
  .get(LocalizationController.getLocalizationById)
  .patch(LocalizationController.updateLocalization)
  .delete(LocalizationController.deleteLocalization);

  // Tambahkan endpoint untuk menyimpan data dari JSON ke database
router.post('/save-localization', LocalizationController.saveJsonToDatabase);

module.exports = router;
