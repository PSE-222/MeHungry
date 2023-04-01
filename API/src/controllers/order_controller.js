// What if item name not in menu? (No way)
// What if food is not available? (FE)
// [x] Should change collection to order_collection? (same in table-controller)
// Add status to order
// Calculate total price (get from FE or double check)
// [x] View order return list of price
const db_object = require('../db/config');

const order_collection = db_object.getDb().collection("Order")

exports.create_order = async (order_id, table_number) => {
	await order_collection.insertOne({order_id: order_id, table_number: table_number, item_name : [], quantity : [], price : []})
	return true;
}

exports.add_item_to_order = async (req,res) => {
	
	list_of_item = req.body;
	list_name = [];
	list_quantity = [];
	list_price = [];
	for (item in list_of_item){
		list_name.append(item["Name"]);
		list_quantity.append(item["Quantity"]);
		list_price.append(parseFloat(item["Price"]));
	}

	await order_collection.updateOne({order_id: req.params.id},{$set: {item_name: list_name, quantity: list_quantity, price: list_price},});
	res.send({msg:"Update Order Successfully!!!"});
};

exports.count_order = async () =>{
	const num_of_order = await order_collection.countDocuments({});
	return num_of_order;
}

exports.view_order = async (req,res) => {
	const order_info = await order_collection.findOne({order_id: req.params.id});
	res.send(order_info)
};

exports.view_current_orders = async (req,res) => {
	const ongoing_order = await order_collection.find({status: "ongoing"}).toArray();
	res.send(ongoing_order);
};

exports.view_orders = async (req,res) => {
	const all_orders_info = await order_collection.find({}).toArray();
	res.send(all_orders_info);
};

exports.finish_order = async (req,res) => {
	const order_info = await order_collection.findOne({order_id: req.params.id});
	if (!order_info){
		res.send({msg: `Order not available`});
		return;
	}

	if (order_info["status"] != "ongoing"){
		res.send({msg: `Order ${req.params.id} Has Finished!!!`});
		return;
	}

	await order_collection.updateOne({order_id: req.params.id},{$set: {status: "finished",},});
	res.send({msg: `Order ${req.params.id} is billed.`});
	
};

