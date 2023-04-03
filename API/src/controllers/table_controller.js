// [x] change table id (others?) to string
// [x] customer_name to table
// [ ] is_occupied -> status: 0-free,1-requested,2-serving,3-checkout
// [ ] What if name inputted is empty?

const db_object = require('../db/config');
const { create_order, count_order } = require('../controllers/order_controller')
const { create_payment } = require('../controllers/payment_controller')
const table_collection = db_object.getDb().collection("Table")

const status_arr =["free","requested","serving","checkout"]

async function create_order_and_payment (table_number){
	const new_order_id = (await count_order() + 1).toString();
	await create_order(new_order_id, table_number);
	await create_payment(new_order_id);
	return new_order_id;
};
exports.request_table = async (req,res) =>{
	const table_id = req.params.id;
	const table_info = await table_collection.findOne({table_id: table_id,});
	
	if (!table_info){
		res.status(404).send({msg: "Invalid Table Number"});
		return;
	}
	if ( table_info["status"] != 0){
		res.send({msg :"Table Is Not Available!!"});
		return;
	}

	await table_collection.updateOne({table_id: table_id}, {$set: {status: 1}})
	const new_table_info = await table_collection.findOne({table_id: table_id},);

	res.send(new_table_info);
};
exports.assign_table = async (req,res) =>{
	const table_number = req.params.number;

	const table_info = await table_collection.findOne({table_number: table_number,});
	if (!table_info){
		res.status(404).send({msg: "Invalid Table Number"});
		return;
	}
	if (table_info["status"] != 2){
		res.send({msg :"Invalid Table Assignment!!!"});
		return;
	}

	if (table_info["customer_name"] != "" ){
		res.send({msg: "Table Is Being Occupied!!!"});
		return;
	}
	await table_collection.updateOne({table_number: table_number}, {$set: {customer_name: req.params.name}})
	await create_order_and_payment(table_info["table_number"]);
	const new_table_info = await table_collection.findOne({table_number: table_number},);

	res.send(new_table_info);
};

exports.change_status_table = async (req,res) => {
	const table_number = req.params.number;
	const table_info = await table_collection.findOne({table_number: table_number});
	
	if (!table_info){
		res.status(404).send({msg: "Invalid Table Number"});
		return;
	}

	var table_status = table_info["status"];
	switch(table_status){
		case 0:
		case 2:
			return res.send({ msg: "Operation Is Invalid!!!" })
		case 1:
			await table_collection.updateOne({table_number: table_number},{$set: {status: 2}});
			break;
		case 3:
			await table_collection.updateOne({table_number: table_number},{$set: {status: 0, customer_name: ""}});
			break;
	}
	var new_status = status_arr[(table_status + 1) % 4]
	return res.send({msg:`Change Status of Table ${table_number} to ${new_status}}`});
};

exports.view_info_table = async (req,res) => {
	const table_id = req.params.id;
	const table_info = await table_collection.findOne({table_id: table_id,});
	if (!table_info){
		res.status(404).send({msg: "Invalid Table ID"});
		return;
	}
	res.send(table_info);
};

exports.view_all_table = async (req,res) => {
	const all_table_info = await table_collection.find({}).toArray();
	res.send(all_table_info)
};
