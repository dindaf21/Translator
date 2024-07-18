const fs = require("fs").promises;
const path = require("path");
const localization = require("../db/models/localization");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const response = require("../utils/response");

const jsonFilePath = path.join(__dirname, "localization.json");
const dataPath = jsonFilePath; // definisikan dataPath

class LocalizationController {
  static createLocalization = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    const newLocalization = await localization.create({
      key: body.key,
      to_locale: body.locale,
      translated_text: body.text,
      createdBy: userId,
    });

    console.log('New Localization:', newLocalization);

    if (!newLocalization) {
      return next(new AppError("Failed to create the localization", 400));
    }

    return success(res, newLocalization, "Localization created");
  });

  static getAllLocalization = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await localization.findAll({
      include: user,
      // where: { createdBy: userId },
    });

    if (!result) {
      return next(new AppError("Data not found", 404));
    }

    return success(res, result, "Localization found");
  });

  static addBahasa = catchAsync(async (req, res, next) => {
    const { key, locale, text } = req.body;
    try {
      console.log(
        `Received request to update key: ${key}, locale: ${locale}, text: ${text}`
      );
      let data = {};
      let locales = [];

      try {
        const fileContent = await fs.readFile(jsonFilePath, "utf8");
        console.log(`File content read successfully from ${jsonFilePath}`);

        if (fileContent.trim() !== "") {
          data = JSON.parse(fileContent);

          for (let k in data) {
            locales = [...new Set([...locales, ...Object.keys(data[k])])];
          }
        }
      } catch (readError) {
        if (readError.code !== "ENOENT") {
          throw readError;
        }
      }

      if (!data[key]) {
        data[key] = {};
        for (let l of locales) {
          data[key][l] = "";
        }
      }

      data[key][locale] = text;

      await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");
      console.log(`Data written successfully to ${dataPath}`);

      // Hanya mengembalikan data yang baru diinput
      const newData = { [key]: { [locale]: text } };
      return success(
        res,
        newData,
        `Updated key: ${key}, locale: ${locale}, text: ${text}`
      );
    } catch (err) {
      console.error(`Error updating ${dataPath}:`, err);
      return next(
        new AppError(`Error updating ${dataPath}: ${err.message}`, 500)
      );
    }
  });

  static getAllBahasa = catchAsync(async (req, res, next) => {
    try {
      const { locale, key } = req.query;
      const dataPath = path.join(__dirname, "data.json");
      const localizationPath = path.join(__dirname, "localization.json");

      // Membaca file data.json
      const dataFile = await fs.readFile(dataPath, "utf-8");
      const jsonData = JSON.parse(dataFile);

      // Membaca file localization.json
      const localizationFile = await fs.readFile(localizationPath, "utf-8");
      const jsonLocalization = JSON.parse(localizationFile);

      let response = {};
      let locales = new Set();

      // Mengumpulkan semua locale yang ada di kedua file JSON
      [jsonData, jsonLocalization].forEach((json) => {
        Object.keys(json).forEach((params) => {
          Object.keys(json[params]).forEach((loc) => {
            locales.add(loc);
          });
        });
      });

      if (locale && !key) {
        // Jika locale tidak ada dalam data, kembalikan pesan "Data not found"
        if (!locales.has(locale)) {
          return success(res, {}, "Data not found");
        }

        // Menampilkan seluruh data yang terdapat pada locale dari kedua file
        [jsonData, jsonLocalization].forEach((json) => {
          Object.keys(json).forEach((params) => {
            if (json[params][locale]) {
              response[params] = json[params][locale];
            }
          });
        });
      } else if (key && !locale) {
        // Menampilkan semua data untuk key yang dicari dari kedua file
        if (jsonData[key]) {
          response[key] = jsonData[key];
        }
        if (jsonLocalization[key]) {
          response[key] = { ...response[key], ...jsonLocalization[key] };
        }

        // Jika key tidak ditemukan dalam kedua file, kembalikan pesan "Data not found"
        if (!response[key]) {
          return success(res, {}, "Data not found");
        }
      } else if (locale && key) {
        // Jika locale tidak ada dalam data, kembalikan pesan "Data not found"
        if (!locales.has(locale)) {
          return success(res, {}, "Data not found");
        }

        // Menampilkan file locale dan key yang dicari dari kedua file
        const dataFound =
          (jsonData[key] && jsonData[key][locale]) ||
          (jsonLocalization[key] && jsonLocalization[key][locale]);

        if (dataFound) {
          if (jsonData[key] && jsonData[key][locale]) {
            response[key] = jsonData[key][locale];
          }
          if (jsonLocalization[key] && jsonLocalization[key][locale]) {
            response[key] = jsonLocalization[key][locale];
          }
        } else {
          return success(res, {}, "Data not found");
        }
      }

      return success(res, response, "Localization found");
    } catch (error) {
      console.error(`Error reading data:`, error);
      return next(new AppError("Failed to read data", 500));
    }
  });

  static getLocalizationById = catchAsync(async (req, res, next) => {
    const localizationId = req.params.id;
    const result = await localization.findByPk(localizationId, {
      include: user,
    });

    if (!result) {
      return next(new AppError("Localization ID not found", 404));
    }

    return success(res, result, "Localization found");
  });

  static updateLocalization = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const localizationId = req.params.id;
    const body = req.body;

    const result = await localization.findOne({
      where: { id: localizationId, createdBy: userId },
    });

    if (!result) {
      return next(new AppError("Invalid localization id", 400));
    }

    const updateResult = await result.update(body);

    return success(res, updateResult, "Localization updated");
  });

  static deleteLocalization = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const localizationId = req.params.id;

    const result = await localization.findOne({
      where: { id: localizationId, createdBy: userId },
    });

    if (!result) {
      return next(new AppError("Invalid localization id", 400));
    }

    await result.destroy();

    return success(res, null, "Data Successfully Deleted");
  });

  static saveJsonToDatabase = async (req, res, next) => {
    try {
      // Ambil data dari body request
      const newLocalizations = req.body;
      const results = { created: [], alreadyExists: [] };
  
      for (const key in newLocalizations) {
        const locales = newLocalizations[key];
        for (const locale in locales) {
          const translatedText = locales[locale];
  
          // Cek apakah entri sudah ada
          const existingLocalization = await localization.findOne({
            where: {
              key,
              translated_text: translatedText,
              to_locale: locale,
            },
          });
  
          // Jika entri tidak ada, buat entri baru
          if (!existingLocalization) {
            await localization.create({
              key,
              translated_text: translatedText,
              to_locale: locale,
            });
            results.created.push({ key, translated_text: translatedText, to_locale: locale });
          } else {
            results.alreadyExists.push({ key, translated_text: translatedText, to_locale: locale });
          }
        }
      }
  
      res.status(200).json({
        message: "Data has been processed", 
        results,
      });
    } catch (error) {
      console.error("Error saving data to database:", error);
      next(error);
    }
  };  
}

module.exports = { LocalizationController };
