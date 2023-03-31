//Payment document: id (same with order_id), status, method, created_time, finished_time, tip, total price
const db_object = require('../db/config');

const payment_collection = db_object.getDb().collection("Payment")

exports.view_payment = async (req,res) => {
	const payment_info = await payment_collection.findOne({id: req.params.id});
	res.send(payment_info)
};

exports.request_payment = async (req,res) => {
	
	list_of_item = req.body;
	list_name = [];
	list_quantity = [];
	list_price = [];
	for (item in list_of_item){
		list_name.append(item["Name"]);
		list_quantity.append(item["Quantity"]);
		list_price.append(parseFloat(item["Price"]));
	}

	await payment_collection.updateOne({order_id: req.params.id},{$set: {item_name: list_name, quantity: list_quantity, price: list_price},});
	res.send({msg:"Update Order Successfully!!!"});
};

exports.view_orders = async (req,res) => {
	const all_orders_info = await payment_collection.find({}).toArray();
	res.send(all_orders_info);
};

exports.finish_order = async (req,res) => {
	const order_info = await payment_collection.findOne({order_id: req.params.id});
	if (!order_info){
		res.send({msg: `Order not available`});
		return;
	}

	if (order_info["status"] != "ongoing"){
		res.send({msg: `Order ${req.params.id} Has Finished!!!`});
		return;
	}

	await payment_collection.updateOne({order_id: req.params.id},{$set: {status: "finished",},});
	res.send({msg: `Order ${req.params.id} is billed.`});
	
};

exports.view_current_orders = async (req,res) => {
	const ongoing_order = await payment_collection.find({status: "ongoing"}).toArray();
	res.send(ongoing_order);
};