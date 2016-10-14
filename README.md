Turms is a simple and lightweight Node messaging system. It provides Hub, Subscriber and Message objects.

It's a single file and works solidly in the one project I originally built it for, but it is very much in beta, or maybe even alpha.

Turms has no dependencies unless you want to run the tests. Then it uses Mocha and Chai.

Usage:

```
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

```
{ foo: 'bar', bar: 'foo' }
```

The Subscriber object provides access to a single function, `receiveMessage`, which only receives two arguments: `action` and `message`. `action` is the callback defined in `addSubscription` and message is the Message passed to `sendMessage`. The `action` callback should expect a single argument that corresponds the message and act on it accordingly.
