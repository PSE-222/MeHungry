// Add id field to food item
const db_object = require('../db/config');

const collection = db_object.getDb().collection("Menu")

exports.add_item = async (req,res) =>{
	item_info = req.body;
	await collection.insertOne(item_info);
	res.send(`Add Item ${item_info.item_name} Successfully!!!`);
};

exports.update_item = async (req,res) => {
	item_info = req.body;
	await collection.updateOne({item_name: item_info.item_name},{$set: item_info});
	res.send(`Update Item ${item_info.item_name} Successfully!!!`);

};

exports.delete_item = async (req,res) => {
	await collection.deleteOne({item_name: req.params.id});
	res.send("Delete item successfully");
};

exports.view_menu = async (req,res) => {
	const menu = await collection.find({}).toArray();
	res.send(menu);
};