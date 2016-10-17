'use strict'

module.exports = {
	/**
	 * An object to be sent to or received by a Messenger.
	 * @param type     A string value that will be used by Messenger.send() to determine
	 *                 which of it's subscribers receive() method is called. Defaults to 'message'.
	 * @param data     A data object for use in the action callback when a message is sent.
	 *                 Defaults to an object with null prototype.
	 * @param delay    The length of time a message will wait before being sent. Defaults to 0.
	 * @param recipient An optional Messenger object that will receive this message.
	 * @return object  A new Message object.
	 */
	Message: function(options) {
		if (!options) options = {};

		return Object.assign(Object.create(null), {
			type: options.type || 'message',
			data: options.data || Object.create(null),
			delay: options.delay || 0,
			recipient: options.recipient
		});
	},
	/**
	 * Returns object that can receive messages. Can be used by itself itself or with Object.assign(ob, subscriber)
	 */
	Subscriber: function() {
		return {
			receiveMessage: function(action, message) {
				action.call(this, message);
			}
		}
	},
	/**
	 * An object that manages subscribers and dispatches messages to them.
	 */
	Hub: function() {
		return {
			subscriptions: [],
			queue: [],
			/**
			 * Adds a new subscription to the Messenger's subscriptions[].
			 * @param  subscriber   A Subscriber object.
			 * @param  messageType  A string value corresponding to Message.type on an incoming Message
			 * @param  action       A callback that will be triggered when the subscriber receives a Message.
			 * @return Object       The subscription object, useful for caching and late use with removeSubscription().
			 */
			addSubscription: function(subscriber, messageType, action) {
				let subscription = {
					subscriber: subscriber,
					messageType: messageType,
					action: action
				}
				this.subscriptions.push(subscription);
				return subscription;
			},
			/**
			 * Removes a subscription with a specific type and specific subscriber.
			 * @param subscriber  A Subscriber object.
			 * @param messageType A string value corresponding to Message.type on an incoming Message.
			 */
			removeSubscription: function(subscriber, messageType) {
				let subscriptions = this.subscriptions.filter((subscription) => {
					return subscription.subscriber === subscriber && subscription.messageType === messageType;
				});
				for (let i = 0, l = subscriptions.length; i < l; i++) {
					let idx = this.subscriptions.indexOf(subscriptions[i]);
					if (idx >= 0) this.subscriptions.splice(idx, 1);
				}
			},
			/**
			 * Filters subscriptions based on messageType and/or recipient
			 */
			filterSubscriptions: function(message) {
				return this.subscriptions.filter((subscription) => {
					return message.recipient ?
						message.type === subscription.messageType && subscription.subscriber === message.recipient :
						message.type === subscription.messageType;
				});
			},
			sendMessage: function(message) {
				if (message.delay > 0)
					return this.queueMessage(message);

				let subscriptions = this.filterSubscriptions(message);

				for (let i = 0, l = subscriptions.length; i < l; i++)
					subscriptions[i].subscriber.receiveMessage(subscriptions[i].action, message);
				return undefined;
			},
			queueMessage: function(message) {
				let delay = message.delay,
					timeout;
				message.delay = 0;
				timeout = setTimeout((timeout) => {
					this.sendMessage(message);
					this.queue.splice(this.queue.indexOf(timeout), 1);
				}, delay);
				this.queue.push(timeout);
				return timeout;
			}
		};
	}
}
