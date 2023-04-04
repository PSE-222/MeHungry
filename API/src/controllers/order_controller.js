// What if item name not in menu? (No way)
// What if food is not available? (FE)
// [x] Should change collection to order_collection? (same in table-controller)
// [ ] Add status to order
// Calculate total price (get from FE or double check)
// [x] View order return list of price
// [ ] Finish order include change status (4 to 0)
// [ ] Add name and check name for table
const db_object = require('../db/config');
const { change_status_table } = require('./table_controller')
const order_collection = db_object.getDb().collection("Order")

exports.create_order = async (order_id, table_number) => {
	await order_collection.insertOne({order_id: order_id, table_number: table_number, item_name : [], quantity : [], price : [], ordered_time: "",status: "ongoing"})
	return true;
}

exports.add_item_to_order = async (req,res) => {
	// let list_item = current_order_info["item_name"];
	// let list_quantity = current_order_info["quantity"];
	// let list_price = current_order_info["price"];

	// const list_of_item = req.body;
	// for (item in list_of_item){
	// 	index = list_item.indexOf(item["Name"]);

	// 	if (index == -1){
	// 		list_item.push(item["Name"]);
	// 		list_quantity.push(item["Quantity"]);
	// 		list_price.push(item["Price"]);
	// 		continue;
	// 	}
	// 	list_quantity[index] += item["Quantity"];
	// }
	const table_number = req.params.number;
	const current_order_info = await order_collection.findOne({table_number: table_number, status: "ongoing"});
	if (!current_order_info){
		return res.send({ msg: "Order Not Existed!!"});
	}
	list_of_item = req.body;

	let list_name = [],	list_quantity = [],	list_price = [];

	for (i = 0; i < list_of_item.length; i++) {
		item = list_of_item[i];
		list_name.push(item["Name"]);
		list_quantity.push(item["Quantity"]);
		list_price.push(parseFloat(item["Price"]));
	}
	
	await order_collection.updateOne({table_number: table_number, status: "ongoing"},{ $set: {item_name: list_name, quantity: list_quantity, price: list_price},});

	return res.send({msg: `Update Order of Table ${table_number} Successfully!!!`});
};

exports.count_order = async () =>{
	const num_of_order = await order_collection.countDocuments({});
	return num_of_order;
}

exports.view_order = async (req,res) => {
	const order_info = await order_collection.findOne({order_id: req.params.id});
	return res.send(order_info)
};

exports.view_current_orders = async (req,res) => {
	const ongoing_order = await order_collection.find({status: "ongoing"}).toArray();
	return res.send(ongoing_order);
};

exports.view_orders = async (req,res) => {
	const all_orders_info = await order_collection.find({}).toArray();
	res.send(all_orders_info);
};

exports.finish_order = async (req,res) => {
	const order_info = await order_collection.findOne({order_id: req.params.id});
	if (!order_info){
		return res.send({msg: `Order not available`});
		
	}

	if (order_info["status"] != "ongoing"){
		return res.send({msg: `Order ${req.params.id} Has Finished!!!`});
		
	}

	await order_collection.updateOne({order_id: req.params.num},{$set: {status: "finished",},});
	req.params.number = order_info["table_number"]
	console.log(req.params.number)
	await change_status_table(req,res);
	return res.send({msg: `Order ${req.params.id} is billed.`});
	
};

