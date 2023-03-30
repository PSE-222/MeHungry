// What if item name not in menu?
// What if food is not available?
// Should change collection to order_collection? (same in table-controller)
// Add status to order
const db_object = require('../db/config');

const order_collection = db_object.getDb().collection("Order")



exports.view_order = async (req,res) => {
	const order_id = Number(req.params.id);
	const order_info = await order_collection.findOne({order_id: order_id});
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

	await order_collection.updateOne({order_id: req.params.id},{$set: {item_name: list_name, quantity: list_quantity,},});
	res.send({msg:"Update Order Successfully!!!"});
};

exports.view_orders = async (req,res) => {
	const all_orders_info = await order_collection.find({}).toArray();
	res.send(all_orders_info);
};
// exports.finish_order = async (req,res) => {
// };