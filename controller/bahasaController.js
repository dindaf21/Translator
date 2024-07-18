// const fs = require('fs').promises;
// const path = require('path');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
// const { success } = require('../utils/response');

// const jsonFilePath = path.join(__dirname, "data.json");

// // Fungsi untuk memperbarui atau menambahkan entri ke dalam file JSON
// async function localization(key, locale, text) {
//   try {
//     let data = {};

//     // Cek apakah file JSON ada sebelum membacanya
//     const fileExists = await fs.stat(jsonFilePath).then(() => true).catch(() => false);
//     if (fileExists) {
//       const fileContent = await fs.readFile(jsonFilePath, "utf8");

//       // Pastikan file tidak kosong sebelum di-parse
//       if (fileContent.trim() !== "") {
//         data = JSON.parse(fileContent);
//       }
//     }

//     // Pastikan ada objek untuk key yang diberikan
//     if (!data[key]) {
//       data[key] = {};
//     }

//     // Tambahkan atau perbarui entri untuk locale dengan nilai text
//     data[key][locale] = text;

//     // Tulis kembali file JSON dengan data yang diperbarui
//     await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
//     console.log(
//       `Updated ${jsonFilePath} with key: ${key}, locale: ${locale}, text: ${text}`
//     );
//   } catch (err) {
//     console.error(`Error updating ${jsonFilePath}:`, err);
//   }
// }

// // Fungsi untuk mengambil nilai berdasarkan key dan locale
// async function locale(key, locale) {
//   try {
//     // Baca file JSON, jika ada. Jika tidak, buat objek kosong
//     let data = {};
//     const fileExists = await fs.stat(jsonFilePath).then(() => true).catch(() => false);
//     if (fileExists) {
//       const fileContent = await fs.readFile(jsonFilePath, "utf8");
//       if (fileContent.trim() !== "") {
//         data = JSON.parse(fileContent);
//       }
//     }

//     // Cari nilai sesuai key dan locale
//     if (data[key] && data[key][locale]) {
//       return data[key][locale];
//     } else {
//       return `No value found for key '${key}' and locale '${locale}'`;
//     }
//   } catch (err) {
//     console.error(`Error reading ${jsonFilePath}:`, err);
//     return `Error reading JSON file`;
//   }
// }

// // Definisikan class controller
// class LocalizationController {
//   // Definisikan metode statis di dalam class
//   static getAllBahasa = catchAsync(async (req, res, next) => {
//     try {
//       const dataPath = path.join(__dirname, 'data.json');
//       const fileContent = await fs.readFile(dataPath, 'utf-8');
//       let result = JSON.parse(fileContent);

//       if (!result) {
//         return next(new AppError('Data not found', 404));
//       }

//       const searchQuery = req.query.search;

//       if (searchQuery) {
//         let filteredResult = {};
//         Object.keys(result).forEach(key => {
//           Object.keys(result[key]).forEach(locale => {
//             if (result[key][locale].toLowerCase().includes(searchQuery.toLowerCase())) {
//               if (!filteredResult[key]) {
//                 filteredResult[key] = {};
//               }
//               filteredResult[key][locale] = result[key][locale];
//             }
//           });
//         });
//         result = filteredResult;
//       }

//       return success(res, result, 'Localization found');
//     } catch (error) {
//       return next(new AppError('Failed to read data', 500));
//     }
//   });
// }

// // Ekspor class controller
// module.exports = LocalizationController;
