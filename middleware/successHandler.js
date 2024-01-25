const successHandler = (data, req, res, next, operation, status = 200) => {
    let message = '';
  
    switch (operation) {
      case 'create':
        message = 'Resource created successfully';
        break;
      case 'update':
        message = 'Resource updated successfully';
        break;
      case 'delete':
        message = 'Resource deleted successfully';
        break;
      default:
        message = 'Operation successful';
    }
  
    return res.status(status).json({ success: true, data, message });
  };
  
  module.exports = successHandler;
  