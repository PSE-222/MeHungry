//change table id (others?) to string
//customer_name to table
const db_object = require('../db/config');

const table_collection = db_object.getDb().collection("Table")

async function create_order (table_number){
	const order_collection = db_object.getDb().collection("Order");
	const new_order_id = (await table_collection.countDocuments({})) + 1;
	await order_collection.insertOne({order_id: new_order_id,table_number: table_number, item_name : [], quantity : [], price : 0.0})
	return new_order_id;
};

exports.assign_table = async (req,res) =>{
	const table_info = await table_collection.findOne({table_number: table_number,});

	if (!table_info["is_occupied"] ){
		res.send({msg :"Table Is Offline!!!"});
		return;
	}
	if (table_info["customer_name"] != "" ){
		res.send({msg: "Table Is Being Occupied!!!"});
		return;
	}
	const order_id = await create_order(table_number);
	await table_collection.updateOne({table_number: table_number},{$set:{customer_name:req.params.name,},});
	
	const new_table_info = await table_collection.findOne({table_number: table_number},);
	return res.send(Object.assign({},new_table_info,{order_id: order_id}))
};

exports.change_status_table = async (req,res) => {
	const table_info = await table_collection.findOne({table_number: table_number});
	const table_status = table_info["is_occupied"];
	// const table_number = table_info["table_number"]

	if (table_status){
		await table_collection.updateOne({table_number: table_number},{$set:{is_occupied: !table_status,customer_name: ""},});
	}
	else{
		await table_collection.updateOne({table_number: table_number},{$set:{is_occupied: !table_status,},});
	}

	return res.send({msg:`Change Status of Table ${table_number} from ${table_status} to ${!table_status}`});
};

exports.view_info_table = async (req,res) => {
	const table_info = await table_collection.findOne({table_id: req.params.id,});
	res.send(table_info);
};

exports.view_all_table = async (req,res) => {
	const all_table_info = await table_collection.find({}).toArray();
	res.send(all_table_info)
};
