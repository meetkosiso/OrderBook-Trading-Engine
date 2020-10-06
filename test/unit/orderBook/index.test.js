import { assert } from 'chai';
import fs from 'fs';
import OrderBook from '../../../lib/process';
import { normaliseObject } from '../../../services';

describe('OrderBook', function() {
	describe('#setbuyOrder', function() {
		it('should set the highest buyer order at the top', function(done) {
			const order1 = new OrderBook();
			order1.setbuyOrder(10, 500, normaliseObject);

			const order2 = new OrderBook();
			order2.setbuyOrder(15, 1000, normaliseObject);

			const order3 = new OrderBook();
			order3.setbuyOrder(90, 400, normaliseObject);

			const order4 = new OrderBook();
			order4.setbuyOrder(50, 2000, normaliseObject);

			const order5 = new OrderBook();
			order5.setbuyOrder(16, 400, normaliseObject);

			assert.equal(order5.buyOrders[0].price, 2000);
			done();
		});
	});

	describe('#setSellOrder', function() {
		it('should set the lowest sell order at the top', function(done) {
			const order1 = new OrderBook();
			order1.setSellOrder(10, 500, normaliseObject);

			const order2 = new OrderBook();
			order2.setSellOrder(15, 1000, normaliseObject);

			const order3 = new OrderBook();
			order3.setSellOrder(90, 400, normaliseObject);

			const order4 = new OrderBook();
			order4.setSellOrder(50, 2000, normaliseObject);

			const order5 = new OrderBook();
			order5.setSellOrder(16, 400, normaliseObject);
			assert.equal(order5.sellOrders[0].price, 400);
			done();
		});
	});
	describe('#GetQuantityAtPrice', function() {
		it('should get quantity at a given price', function(done) {
			const order = new OrderBook();
			const result = order.getQuantityAtPrice(400);
			assert.equal(result, 106);
			done();
		});
	});
	describe('#getOrder', function() {
		it('should get order by id', function(done) {
			const order = new OrderBook();
			const orderFound = order.getOrder(2);
			assert.equal(orderFound.price, 1300);
			done();
		});
	});
	it('should return an instance of an error if price is not found', function(done) {
		const order = new OrderBook();
		const result = order.getQuantityAtPrice(401);
		assert.instanceOf(result, Error);
		done();
	});
	describe('#Buy', function() {
		it('should buy successfully', function(done) {
			const order = new OrderBook();
			order.buy(10, 400);
			assert.equal(order.buyOrders[0].executedQuantity, 10);
			done();
		});
	});
	describe('#Sell', function() {
		it('should sell successfully', function(done) {
			const order = new OrderBook();
			order.sell(30, 400);
			assert.equal(order.sellOrders[0].executedQuantity, 30);
			done();
		});
	});
	describe('sync/Write', function() {
		this.timeout(10000);

		it('it should save a file successfully', function(done) {
			const order = new OrderBook();
			order.writeToFile('example.json', { test: 1 }, fs).then(response => {
				assert.equal(response.test, 1);
				done();
			});
		});
		it('should sync a files successfully', function(done) {
			const order = new OrderBook();
			const orderBook = order.sync('example.json', fs);
			assert.equal(orderBook.test, 1);
			done();
		});
	});
});
