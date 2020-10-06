import fs from 'fs';
import { normaliseObject } from '../services';
import OrderBook from './process';

const orderBookFileName = 'orderBook.json';

class Exchange {
	sync(fileName) {
		const order = new OrderBook();
		const syncedBook = order.sync(fileName, fs);
		return syncedBook;
	}

	buy(quantity, price) {
		const order = new OrderBook();
		order.setbuyOrder(quantity, price, normaliseObject);

		const sellOrderQuantity = order.sellOrders[0].quantity;
		const sellOrderPrice = order.sellOrders[0].price;

		if (order.sellOrders.length === 0) {
			throw new Error('No available sell order');
		}

		const buyInstance = order.buy(sellOrderQuantity, sellOrderPrice);

		if (buyInstance instanceof Error) {
			throw new Error(buyInstance);
		}
		const buyfulfilledQuantity =
			order.buyOrders[0].quantity - order.buyOrders[0].executedQuantity;

		order.sellOrders[0].executedQuantity += buyInstance;
		const sellfulfillQuantity =
			order.sellOrders[0].quantity - order.sellOrders[0].executedQuantity;

		if (buyfulfilledQuantity === 0) {
			const id = order.buyOrders[0].id;
			const index = order.buyOrders.findIndex(item => item.id === id);
			order.buyOrders.splice(index, 1);
		}

		if (sellfulfillQuantity === 0) {
			const id = order.sellOrders[0].id;
			const index = order.sellOrders.findIndex(item => item.id === id);
			order.sellOrders.splice(index, 1);
		}
		// persist to file
		order.writeToFile(
			orderBookFileName,
			[order.buyOrders, order.sellOrders],
			fs
		);
	}

	sell(quantity, price) {
		const order = new OrderBook();
		order.setSellOrder(quantity, price, normaliseObject);

		const sellOrderQuantity = order.buyOrders[0].quantity;
		const sellOrderPrice = order.buyOrders[0].price;

		if (order.buyOrders.length === 0) {
			throw new Error('No available sell order');
		}

		const sellInstance = order.sell(sellOrderQuantity, sellOrderPrice);

		if (sellInstance instanceof Error) {
			throw new Error(sellInstance);
		}

		const sellfulfilledQuantity =
			order.sellOrders[0].quantity - order.sellOrders[0].executedQuantity;

		order.buyOrders[0].executedQuantity += sellInstance;
		const buyfulfillQuantity =
			order.buyOrders[0].quantity - order.buyOrders[0].executedQuantity;

		if (sellfulfilledQuantity === 0) {
			const id = order.sellOrders[0].id;
			const index = order.sellOrders.findIndex(item => item.id === id);
			order.sellOrders.splice(index, 1);
		}

		if (buyfulfillQuantity === 0) {
			const id = order.buyOrders[0].id;
			const index = order.buyOrders.findIndex(item => item.id === id);
			order.buyOrders.splice(index, 1);
		}
		// persist to file
		order.writeToFile(
			orderBookFileName,
			[order.buyOrders, order.sellOrders],
			fs
		);
	}

	getQuantityAtPrice(price) {
		// TODO
		const order = new OrderBook();
		const orderfound = order.getQuantityAtPrice(price);
		return orderfound;
	}

	getOrder(id) {
		const order = new OrderBook();
		const orderFound = order.getOrder(id);
		return orderFound;
	}
}

export default Exchange;
