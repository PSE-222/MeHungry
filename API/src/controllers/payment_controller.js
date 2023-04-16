// [x] Payment document: id (same with order_id), status, method, created_time, finished_time, tip, total price
// Return total price for request_payment
const db_object = require('../db/config');

const payment_collection = db_object.getDb().collection("Payment")

exports.create_payment = async (order_id) => {
	await payment_collection.insertOne({id: order_id, status: "processing", method: "cash", created_time: "", finished_time: "", tip: 0.0, total: 0.0})
	return true;
}

exports.request_payment = async (req,res) => {
	const payment_id = req.params.id;
	const payment_info = await payment_collection.findOne({id: payment_id});
	if (!payment_info){
		res.status(404).send({msg: "Payment Not Existed!"});
		return;
	}

	if (payment_info["status"] != "processing"){
		res.send({msg: "Invalid Operation!"});
		return;
	}
	await payment_collection.updateOne({id: payment_id},{$set: {status: "requested"},});
	
	res.send({msg:"Waiting For The Bill!!!"});
};

exports.finish_payment = async (req,res) => {
	const payment_id = req.params.id;
	const payment_info = await payment_collection.findOne({id: payment_id});
	
	if (!payment_info){
		res.status(404).send({msg: "Payment Not Existed!"});
		return;
	}

	if (payment_info["status"] != "processing"){
		res.send({msg: "Invalid Operation!"});
		return;
	}
	req.body["tip"] = float(req.body["tip"])
	req.body["total"] = float(req.body["total"]) + req.body["tip"]
	const payment_details = Object.assign({}, req.body, {status: "done"});

	await payment_collection.updateOne({id: payment_id},{$set: payment_details,});
	res.send({msg:"Payment is done!!!"});
};

exports.view_payment = async (req,res) => {
	const payment_info = await payment_collection.findOne({id: req.params.id});
	if (!payment_info){
		res.status(404).send({msg: "Payment Not Existed!"});
		return;
	}
	res.send(payment_info);
};

exports.view_all_payments = async (req,res) => {
	const all_payment_info = await payment_collection.find({}).toArray();
	res.send(all_payment_info);
};

