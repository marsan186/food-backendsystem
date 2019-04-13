module.exports = (app) => {
    const deliveryboy = require('../controllers/deliveryboyController.js');
    const authenticate = require("../middleware/authenticate");

    // Create a new deliveryBoy
    app.post('/deliveryboy', deliveryboy.createDeliveryBoy);
    
	// DeliveryBoy login
    app.post('/deliveryboy/login', deliveryboy.deliveryBoyLogin);

    // Retrieve all deliveryBoy
    app.get('/deliveryboy',authenticate, deliveryboy.getDeliveryBoyDetails);

    // Retrieve a single deliveryBoy with Id
    app.get('/deliveryboy/:UserId',authenticate, deliveryboy.findDeliveryBoyByUserId);

    // Update a deliveryBoy with Id
    app.put('/deliveryboy/:UserId',authenticate, deliveryboy.updateDeliveryBoyByUserId);

    // Delete a deliveryboy with Id
   app.delete('/deliveryboy/:UserId',authenticate, deliveryboy.deleteDeliveryBoyByUserId);
}