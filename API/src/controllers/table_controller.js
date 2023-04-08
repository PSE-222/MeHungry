// [x] change table id (others?) to string
// [x] customer_name to table
// [ ] is_occupied -> status: 0-free,1-requested,2-serving,3-checkout
// [ ] What if name inputted is empty?


const db_object = require('../db/config');
const { create_order, count_order } = require('./order_controller')
const { create_payment } = require('./payment_controller')
const table_collection = db_object.getDb().collection("Table")

const status_arr =["free","requested","serving","checkout"]

async function create_order_and_payment (table_number){
	const new_order_id = (await count_order() + 1).toString();
	await create_order(new_order_id, table_number);
	await create_payment(new_order_id);
};
exports.request_table = async (req,res) =>{
	const table_id = req.params.id;
	const table_info = await table_collection.findOne({table_id: table_id,});
	
	if ( !table_info )
		return res.status(404).send({msg: "Invalid Table Number"});

	if ( table_info["status"] == 2 || table_info["status"] == 3 )
		return res.send({status: table_info["status"], msg :"Table Is Not Available!!"});

	// await table_collection.updateOne({table_id: table_id}, {$set: {status: 1}})
	// const new_table_info = await table_collection.findOne({table_id: table_id},);

	res.send(table_info);
};

exports.assign_table = async (req,res) =>{
	const table_number = req.params.number;

	const table_info = await table_collection.findOne({table_number: table_number,});
	if ( !table_info )
		return res.status(404).send({msg: "Invalid Table Number"});
		
	if (table_info["status"] != 0){
		console.log(table_info["status"])
		return res.send({msg :"Invalid Table Assignment!!!"});
	}

	if (table_info["customer_name"] != "" )
		return res.send({msg: "Table Is Being Occupied!!!"});

	await table_collection.updateOne({table_number: table_number}, {$set: {status: 1, customer_name: req.params.name}})
	const new_table_info = await table_collection.findOne({table_number: table_number},);

	return res.send(new_table_info);
};

exports.checkout_table = async (req,res) =>{
	const table_number = req.params.number;
	
	const table_info = await table_collection.findOne({table_number: table_number,});
	if (!table_info){
		res.status(404).send({msg: "Invalid Table Number"});
		return;
	}
	if (table_info["status"] != 2)
		return res.send({msg :"Invalid Table Checkout!!!"});

	if (table_info["customer_name"] == "" )
		return res.send({msg: "Table Is Not Used!!!"});
	const payment_details = req.body
	const assoc_order = await db_object.getDb().collection("Order").findOne({table_number: table_number, status: "ongoing"});
	
	await table_collection.updateOne({table_number: table_number}, {$set: {status: 3}})
	await db_object.getDb().collection("Payment").updateOne({id: assoc_order["order_id"]},{$set: payment_details})
	return res.send({ msg: "Request checkout successfully"});
}
exports.change_status_table = async (table_number) =>{
	const table_info = await table_collection.findOne({table_number: table_number});
	
	if (!table_info)
		return {status: 404, msg: "Invalid Table Number"};

	var table_status = table_info["status"];
	switch(table_status){
		case 0:
		case 2:
			return res.send({status: 404, msg: "Operation Is Invalid!!!" })
		case 1:
			await table_collection.updateOne({table_number: table_number},{$set: {status: 2}});
			await create_order_and_payment(table_info["table_number"]);
			break;
		case 3:
			await table_collection.updateOne({table_number: table_number},{$set: {status: 0, customer_name: ""}});
			return;
	}
	var new_status = status_arr[(table_status + 1) % 4]
	return {status: 200, msg:`Change Status of Table ${table_number} to ${new_status}`};
};

exports.update_status = async (req,res) => {
	const table_number = req.params.number;
	return_value = await this.change_status_table(table_number);
	res.status(return_value["status"]).send(return_value["msg"]);
};

exports.view_info_table = async (req,res) => {
	const table_id = req.params.id;
	const table_info = await table_collection.findOne({table_id: table_id,});
	if (!table_info){
		res.status(404).send({msg: "Invalid Table ID"});
		return;
	}
	return res.send(table_info);
};

exports.view_all_table = async (req,res) => {
	const all_table_info = await table_collection.find({}).toArray();
	return res.send(all_table_info);
};
