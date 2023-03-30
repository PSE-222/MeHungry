// Add id field to food item
// What happened if item not exist?
const db_object = require('../db/config');

const menu_collection = db_object.getDb().collection("Menu")

exports.add_item = async (req,res) =>{
	item_info = req.body;
	await menu_collection.insertOne(item_info);
	res.send({msg: `Add Item ${item_info.item_name} Successfully!!!`});
};

exports.update_item = async (req,res) => {
	item_info = req.body;
	await menu_collection.updateOne({item_name: item_info.item_name},{$set: item_info});
	res.send({msg: `Update Item ${item_info.item_name} Successfully!!!`});

};

exports.delete_item = async (req,res) => {
	await menu_collection.deleteOne({item_name: req.params.id});
	res.send({msg: `Delete Item successfully`});
};

exports.view_menu = async (req,res) => {
	const menu = await menu_collection.find({}).toArray();
	res.send(menu);
};