// [x] Add id field to food item
// What happened if item not exist?
// What happend if added item existed?
const db_object = require('../db/config');

const menu_collection = db_object.getDb().collection("Menu")

async function random_id(){
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var result = '';
    for (var i = 6; i > 0; --i)
		result += chars[Math.floor(Math.random() * 62)];
    return result;
}
exports.add_item = async (req,res) =>{
	var item_info = req.body;
	var new_id = await random_id();
	while (await menu_collection.findOne({item_id: new_id})){
		new_id = await random_id();
	}
	const item_check = await menu_collection.findOne({item_name: item_info["item_name"]})
	if (item_check){
		return res.send({ msg: "Item existed"});
	}
	item_info = Object.assign({},{item_id: new_id},item_info);
	await menu_collection.insertOne(item_info);

	res.send({msg: `Add Item ${item_info.item_name} Successfully!!!`});
};

exports.update_item = async (req,res) => {
	const item_info = req.body;
	const item_check = await menu_collection.findOne({item_name: item_info["item_name"]})
	if (!item_check){
		return res.send({ msg: "Item Not Existed"});
	}
	await menu_collection.updateOne({item_id: item_info.item_id},{$set: item_info});
	res.send({msg: `Update Item ${item_info.item_name} Successfully!!!`});
};

exports.delete_item = async (req,res) => {
	await menu_collection.deleteOne({item_id: req.params.id});
	res.send({msg: `Delete Item Successfully`});
};

exports.view_menu = async (req,res) => {
	const menu = await menu_collection.find({}).toArray();
	res.send(menu);
};