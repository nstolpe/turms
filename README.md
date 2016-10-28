Turms is a simple and lightweight Node messaging system. It provides Hub, Subscriber and Message objects.

Turms consists of two modules/files. `turms.js` is the messenger and provides factory functions for `Message`, `Subscriber` and `Hub` objects. `timer.js` is a more accurate and self-adjusting alternative to `setTimeout` that `Hub` uses for sending delayed messages.

Turms has no dependencies unless you want to run the tests. Then it uses Mocha and Chai.

Usage:

```javascript
const Turms = require('./turms');
const hub = Turms.Hub();
const subscriber = Turms.Subscriber();

hub.addSubscription(subscriber, 'message', (message) => console.log(message.data));

hub.sendMessage(
	Turms.Message({
		// type could be ignored as 'message' is the default type.
		type: 'message',
		data: { foo: 'bar', bar: 'foo' }
		// other options are:
		//     delay, for sending a message in the future
		// and
		//     recipient, for sending a message only to a specific subscriber
	})
);
```

Output:

```javascript
{ foo: 'bar', bar: 'foo' }
```

More documentation can be found at the [Wiki](https://github.com/nstolpe/turms/wiki).
