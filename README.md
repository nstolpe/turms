Turms is a node messenging system. It provides Hub, Subscriber and Message objects.

Usage:

```
const Turms = require('./turms');
const hub = Turms.Hub();
const subscriber = Turms.Subscriber(hub);

hub.addSubscription(subscriber, 'message', (message) => console.log(message.data));

hub.sendMessage(
	Turms.Message({
		// type could be ignored as 'message' is the default type.
		// other options are delay and receiver (receiver is as yet unimplemented).
		type: 'message',
		data: { foo: 'bar', bar: 'foo' }
	})
);
```

Output:

```
{ foo: 'bar', bar: 'foo' }
```

The Subscriber object provides access to a single function, `receiveMessage`, which only receives two arguments: `action` and `message`. `action` is the callback defined in `addSubscription` and message is the Message passed to `sendMessage`. The `action` callback should expect a single argument that corresponds the message and act on it accordingly.
