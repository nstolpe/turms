'use strict'

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Turms = require('../turms');

describe('Turms', function() {
	it('Message() should return default values if `options` is empty or not passed', function() {
		let defaultMessage = Turms.Message({
			type: 'message',
			data: Object.create(null),
			delay: 0,
			recipient: undefined
		});
		let message = Turms.Message();
		expect(message).to.eql(defaultMessage);
	});
	it('A Hub\'s addSubscription() method should add a new subscription object to Messenger.subscriptions. That object should have properties and values corresponding to addSubscription arguments.', function() {
		let hub = Turms.Hub();
		let subscriber = Turms.Subscriber();
		let subscription = {
			subscriber: subscriber,
			messageType: 'test-message',
			action: function(message) { console.log(message); }
		}
		hub.addSubscription(subscription.subscriber, subscription.messageType, subscription.action);

		expect(hub.subscriptions[0]).to.eql(subscription);
	});
	it('A Hub\'s addSubscription() method should return a new subscription object with properties and values corresponding to the arguments passed in', function() {
		let hub = Turms.Hub();
		let subscriber = Turms.Subscriber();
		let subscription = {
			subscriber: subscriber,
			messageType: 'test-message',
			action: function(message) { console.log(message); }
		}
		let newSubscription = hub.addSubscription(subscription.subscriber, subscription.messageType, subscription.action);

		expect(newSubscription).to.eql(subscription);
	});
	it('When a Hub sends a Message with a recipient option, only that recipient will receive the message', function() {
		let recipient;
		let hub = Turms.Hub();
		let subscriber1 = Turms.Subscriber();
		let subscriber2 = Turms.Subscriber();

		// this callback should be called.
		hub.addSubscription(subscriber1, "test-message", (message) => recipient = message.recipient);
		// this callback should not be called.
		hub.addSubscription(subscriber2, "test-message", (message) => recipient = message.recipient);

		hub.sendMessage(Turms.Message({ type: 'test-message', recipient: subscriber1 }));
		expect(recipient).to.eql(subscriber1);
	});
	it('When a Hub sends a Message with a recipient option, only that recipient will receive the message', function() {
		let clock = sinon.useFakeTimers();
		let timedOut = false;
		let hub = Turms.Hub();
		let subscriber1 = Turms.Subscriber();

		hub.addSubscription(subscriber1, "test-message", (message) => timedOut = true);

		hub.sendMessage(Turms.Message({ type: 'test-message', delay: 500 }));

		expect(timedOut).to.be.false
		clock.tick(510);
		expect(timedOut).to.be.true

		clock.restore();
	});
});
