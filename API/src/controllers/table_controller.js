// [x] change table id (others?) to string
// [x] customer_name to table
const db_object = require('../db/config');
const { create_order, count_order } = require('../controllers/order_controller')
const { create_payment } = require('../controllers/payment_controller')
const table_collection = db_object.getDb().collection("Table")

async function create_order_and_payment (table_number){
	const new_order_id = (await count_order() + 1).toString();
	await create_order(new_order_id, table_number);
	await create_payment(new_order_id)
	return new_order_id;
};

exports.assign_table = async (req,res) =>{
	const table_number = req.params.number;
	const table_info = await table_collection.findOne({table_number: table_number,});
	if (!table_info){
		res.status(404).send({msg: "Invalid Table Number"});
		return;
	}
	if (!table_info["is_occupied"] ){
		res.send({msg :"Table Is Offline!!!"});
		return;
	}
	if (table_info["customer_name"] != "" ){
		res.send({msg: "Table Is Being Occupied!!!"});
		return;
	}
	await table_collection.updateOne({table_number: table_number}, {$set: {customer_name: req.params.name}})
	const order_id = await create_order_and_payment(table_info["table_number"]);
	const new_table_info = await table_collection.findOne({table_number: table_number},);

	res.send(Object.assign({},new_table_info,{order_id: order_id}))
};

exports.change_status_table = async (req,res) => {
	const table_number = req.params.number;
	const table_info = await table_collection.findOne({table_number: table_number});
	
	if (!table_info){
		res.status(404).send({msg: "Invalid Table Number"});
		return;
	}

	const table_status = table_info["is_occupied"];

	if (table_status){
		await table_collection.updateOne({table_number: table_number},{$set:{is_occupied: !table_status,customer_name: ""},});
	}
	else{
		await table_collection.updateOne({table_number: table_number},{$set:{is_occupied: !table_status,},});
	}

	return res.send({msg:`Change Status of Table ${table_number} from ${table_status} to ${!table_status}`});
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
