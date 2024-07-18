module.exports = {
    success: function (res, data, message = 'Operation successful') {
      return res.status(200).json({
        status: 'success',
        message: message,
        data: data,
      });
    },
  
    dataNotFound: function (res, message = 'Data not found') {
      return res.status(404).json({
        status: 'fail',
        message: message,
      });
    }
  };