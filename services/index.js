export function normaliseObject(
	quantity,
	price,
	id,
	isOrder,
	executedQuantity
) {
	return { price, quantity, id, isOrder, executedQuantity };
}
