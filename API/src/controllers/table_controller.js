const db_object = require('../db/config');

const collection = db_object.getDb().collection("Table")

exports.assign_table = async (req,res) =>{

	if (table_info["is_occupied"] == False){
		res.send("Table Is Offline!!!")
	}

	await collection.updateOne({table_id: req.params.id},{$set:{customer_name:req.params.name,},});
	return res.send("Assign Table Successfully!!!");
};

exports.change_status_table = async (req,res) => {
	const table_info = await collection.findOne({table_id: req.params.id});
	const table_status = table_info["is_occupied"];
	const table_number = table_info["table_number"]
	await collection.updateOne({table_id: req.params.id},{$set:{is_occupied: !table_status,},});
	return res.send(`Change Status of Table ${table_number} from ${table_status} to ${!table_status}`);
};

exports.view_info_table = async (req,res) => {
	const table_info = await collection.findOne({table_id: req.params.id});
	res.send(table_info)
};

exports.view_all_table = async (req,res) => {
	const all_table_info = await collection.find({}).toArray();
	res.send(all_table_info)
};
