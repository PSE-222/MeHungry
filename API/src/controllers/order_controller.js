// What if item name not in menu?
// What if food is not available?
// Should change collection to order_collection? (same in table-controller)
const db_object = require('../db/config');

const collection = db_object.getDb().collection("Order")



exports.view_order = async (req,res) => {
	const order_info = await collection.findOne({order_id: req.params.id});
	res.send(order_info)
};

exports.add_item_to_order = async (req,res) => {
	
	list_of_item = req.body;
	list_name = [];
	list_quantity = [];

	for (item in list_of_item){
		list_name.append(item["Name"]);
		list_quantity.append(item["Quantity"]);
	}

	await collection.updateOne({order_id: req.params.id},{$set: {item_name: list_name, quantity: list_quantity,},});
	res.send("Update Order Successfully!!!");
};

// exports.finish_order = async (req,res) => {
// };