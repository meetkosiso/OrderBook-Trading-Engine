import { assert } from 'chai';
import OrderBook from '../../../lib';
import { normaliseObject } from '../../../services';
import OrderBookProcess from '../../../lib/process';

describe('OrderBook Integration Test', function() {
	describe('#Buy', function() {
		it('should buy successfully', function(done) {
			const orderProcess = new OrderBookProcess();
			orderProcess.setSellOrder(10, 1050, normaliseObject);

			const order = new OrderBook();
			order.buy(1000, 1300);
			const orderFound = order.getOrder(1);
			assert.equal(orderFound.executedQuantity, 10);
			done();
		});
		it('should successfully fulfill next order', function(done) {
			const orderProcess = new OrderBookProcess();
			orderProcess.setSellOrder(20, 1050, normaliseObject);

			const order = new OrderBook();
			order.buy(1001, 1300);
			const orderFound = order.getOrder(1);
			assert.equal(orderFound.executedQuantity, 30);
			done();
		});
		it('should remove the order from order book on successful fulfillment', function(done) {
			const orderProcess = new OrderBookProcess();
			orderProcess.setSellOrder(1100, 1001, normaliseObject);

			const order = new OrderBook();
			order.buy(130, 1310);

			const orderFound = order.getOrder(1);
			assert.equal(orderFound.executedQuantity, 30);
			done();
		});
	});
	describe('#Sell', function() {
		it('should sell successfully', function(done) {
			const orderProcess = new OrderBookProcess();
			orderProcess.setbuyOrder(1000, 1600, normaliseObject);

			const order = new OrderBook();
			order.sell(324, 1210);

			const orderFound = orderProcess.sellOrders.filter(
				item => item.price === 1210
			)[0];
			assert.equal(orderFound.executedQuantity, 0);
			done();
		});
	});
	describe('#Sync', function() {
		it('should sync orderBook successfully', function(done) {
			const orderBookFileName = 'orderBook.json';
			const order = new OrderBook();

			const orderSync = order.sync(orderBookFileName);
			assert.isAbove(orderSync.length, 0);
			done();
		});
	});
});
