//Payment document: id (same with order_id), status, method, created_time, finished_time, tip, total price
const db_object = require('../db/config');

const payment_collection = db_object.getDb().collection("Payment")

exports.create_payment = async (order_id) => {
	await payment_collection.insertOne({payment_id: order_id, status: "processing", method: "cash", created_time: "", finished_time: "", tip: 0.0, total: 0.0})
	return true;
}

exports.request_payment = async (req,res) => {
	await payment_collection.updateOne({payment_id: req.params.id},{$set: {status: "requested"},});
	res.send({msg:"Waiting For The Bill!!!"});
};

exports.finish_payment = async (req,res) => {
	await payment_collection.updateOne({payment_id: req.params.id},{$set: {status: "done"},});
	res.send({msg:"Payment is done!!!"});
};

exports.view_payment = async (req,res) => {
	const payment_info = await payment_collection.findOne({payment_id: req.params.id});
	if (!payment_info){
		res.status(404).send({msg: "Payment Not Existed!"});
		return;
	}
	res.send(payment_info);
};

exports.view_all_payments = async (req,res) => {
	const all_payment_info = await payment_collection.findOne({});
	res.send(all_payment_info);
};

