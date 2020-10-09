const buyOrders = [];
const sellOrders = [];

class Exchange {
	constructor() {
		this.buyOrders = buyOrders;
		this.sellOrders = sellOrders;
	}

	sync(fileName, fs) {
		const rawdata = fs.readFileSync(fileName);
		const orderBook = JSON.parse(rawdata);
		this.buyOrders = orderBook[0];
		this.sellOrders = orderBook[1];
		return orderBook;
	}

	writeToFile(fileName, data, fs) {
		const stringifyData = JSON.stringify(data);
		return new Promise((resolve, reject) => {
			fs.writeFile(fileName, stringifyData, err => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	}

	buy(quantity, price) {
		let quantityNeeded = this.buyOrders[0].quantity;

		while (quantityNeeded > 0) {
			if (this.buyOrders.length === 0)
				throw new Error('No quantity is available');
			if (this.buyOrders[0].price < price) {
				return new Error('Price is too high');
			}
			const remainingOrders =
				quantityNeeded - this.buyOrders[0].executedQuantity;

			if (remainingOrders <= 0) {
				return new Error('Order fulfilled');
			}

			if (remainingOrders >= quantity) {
				this.buyOrders[0].executedQuantity += quantity;
				quantityNeeded -= quantity;
				return quantity;
			}
			this.buyOrders[0].executedQuantity += remainingOrders;
			quantityNeeded -= quantity;
			return remainingOrders;
		}
		return quantityNeeded;
	}

	setSellOrder(quantity, price, normaliseObject) {
		if (quantity === 0 || price === 0) throw new Error('no valid argument');
		const sellOrdersInstance = this.sellOrders;
		let order = null;

		if (sellOrdersInstance.length === 0) {
			order = normaliseObject(quantity, price, 1, true, 0);
			this.sellOrders.push(order);
			return;
		}
		let i = 0;
		let index = -1;

		while (
			i !== sellOrdersInstance.length &&
			price >= sellOrdersInstance[i].price
		) {
			index = i;
			i += 1;
		}
		const orderIndex = index + 1;
		const orderId = sellOrdersInstance.length + 1;
		order = normaliseObject(quantity, price, orderId, true, 0);
		this.sellOrders.splice(orderIndex, 0, order);
	}

	sell(quantity, price) {
		let quantityNeeded = this.sellOrders[0].quantity;
		while (quantityNeeded > 0) {
			if (this.sellOrders.length === 0) throw new Error('Insufficient Demand');
			// 	console.log('this.sellOrders[0].price', this.sellOrders[0].price, price);
			if (this.sellOrders[0].price > price) {
				return new Error('Price is too low');
			}
			const remainingOrders =
				quantityNeeded - this.sellOrders[0].executedQuantity;

			if (remainingOrders <= 0) {
				return new Error('Order fulfilled');
			}
			if (remainingOrders >= quantity) {
				this.sellOrders[0].executedQuantity += quantity;
				quantityNeeded -= quantity;
				return quantity;
			}
			this.sellOrders[0].executedQuantity += remainingOrders;
			quantityNeeded -= quantity;
			return remainingOrders;
		}
		return quantityNeeded;
	}

	setbuyOrder(quantity, price, normaliseObject) {
		if (quantity === 0 || price === 0) throw new Error('no valid argument');
		const buyOrdersInstance = this.buyOrders;
		let order = null;

		if (buyOrdersInstance.length === 0) {
			order = normaliseObject(quantity, price, 1, true, 0);
			this.buyOrders.push(order);
			return;
		}
		let i = 0;
		let index = -1;

		while (
			i !== buyOrdersInstance.length &&
			price <= buyOrdersInstance[i].price
		) {
			index = i;
			i += 1;
		}

		const orderIndex = index + 1;
		const orderId = buyOrdersInstance.length + 1;
		order = normaliseObject(quantity, price, orderId, true, 0);
		this.buyOrders.splice(orderIndex, 0, order);
	}

	getQuantityAtPrice(price) {
		const sellOrdersInstance = this.sellOrders;
		const quantityAtPrice = sellOrdersInstance.filter(
			scoop => scoop.price === price
		);
		if (quantityAtPrice.length === 0) {
			return new Error('price not found');
		}
		const sumQuantityAtPrice = quantityAtPrice.reduce(
			(sum, scoop) => sum + scoop.quantity,
			0
		);
		return sumQuantityAtPrice;
	}

	getOrder(id) {
		const orderFound = this.buyOrders.filter(scoop => scoop.id === id);
		return orderFound[0];
	}
}

export default Exchange;
