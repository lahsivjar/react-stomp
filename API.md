## SockJsClient

[src/client.jsx:15-279][23]

**Extends React.Component**

-   **See: [STOMP][24]**
-   **See: [StompJS][25]**


## Methods

### connect

[src/client.jsx:232-237][26]

Connect to the server if not connected. Under normal circumstances component
will automatically try to connect to server. This method is mostly useful
after component is explicitly disconnected via [SockJsClient#disconnect][27].

### disconnect

[src/client.jsx:244-262][28]

Disconnect STOMP client and disable all reconnect.

### sendMessage

[src/client.jsx:272-279][29]

Send message to the specified topic.

#### Parameters

-   `topic` **[string][30]** target topic to send message
-   `msg` **[string][30]** message to send
-   `opt_headers` **[Object][31]** additional headers for underlying STOMP client (optional, default `{}`)

## Props

### url

[src/client.jsx:32-32][32]

HTTP URL of the endpoint to connect.

### options

[src/client.jsx:38-38][33]

-   **See: [SockJS-options][34]**

Additional options to pass to the underlying SockJS constructor.

### topics

[src/client.jsx:42-42][35]

Array of topics to subscribe to.

### onConnect

[src/client.jsx:46-46][36]

Callback after connection is established.

### onDisconnect

[src/client.jsx:50-50][37]

Callback after connection is lost.

### getRetryInterval

[src/client.jsx:56-56][38]

Gets called to find the time interval for next retry. Defaults to a function returing retryCount seconds.

#### Parameters

-   `retryCount` **[number][39]** number of retries for the current disconnect

### onMessage

[src/client.jsx:63-63][40]

Callback when a message is recieved.

#### Parameters

-   `msg` **([string][30] \| [Object][31])** message received from server, if JSON format then object
-   `topic` **[string][30]** the topic on which the message was received

### headers

[src/client.jsx:67-67][41]

Headers that will be passed to the server or broker with STOMP's connection frame.

### subscribeHeaders

[src/client.jsx:71-71][42]

Headers that will be passed when subscribing to a destination.

### autoReconnect

[src/client.jsx:75-75][43]

Should the client try to automatically connect in an event of disconnection.

### debug

[src/client.jsx:79-79][44]

Enable debugging mode.

### heartbeat

[src/client.jsx:83-83][45]

Number of milliseconds to send and expect heartbeat messages.

### heartbeatIncoming

[src/client.jsx:87-87][46]

Number of milliseconds to expect heartbeat messages

### heartbeatOutgoing

[src/client.jsx:91-91][47]

Number of milliseconds to send heartbeat messages

### onConnectFailure

[src/client.jsx:95-95][48]

Callback when connection could not be established

#### Parameters

-   `error` **([Object][31])** error throwed by the SockJs Client

[23]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L15-L271 "Source code on GitHub"

[24]: https://stomp.github.io/

[25]: https://github.com/sockjs/sockjs-client

[26]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L224-L229 "Source code on GitHub"

[27]: #sockjsclientdisconnect

[28]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L236-L254 "Source code on GitHub"

[29]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L264-L270 "Source code on GitHub"

[30]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[31]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[32]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L32-L32 "Source code on GitHub"

[33]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L38-L38 "Source code on GitHub"

[34]: https://github.com/sockjs/sockjs-client#sockjs-client-api

[35]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L42-L42 "Source code on GitHub"

[36]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L46-L46 "Source code on GitHub"

[37]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L50-L50 "Source code on GitHub"

[38]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L56-L56 "Source code on GitHub"

[39]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[40]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L63-L63 "Source code on GitHub"

[41]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L67-L67 "Source code on GitHub"

[42]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L71-L71 "Source code on GitHub"

[43]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L75-L75 "Source code on GitHub"

[44]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L79-L79 "Source code on GitHub"

[45]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L83-L83 "Source code on GitHub"

[46]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L87-L87 "Source code on GitHub"

[47]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L91-L91 "Source code on GitHub"

[48]: https://github.com/lahsivjar/react-stomp/blob/b31bf86947f5a1cf094f8839b9efcc30cc4d0c36/src/client.jsx#L95-L95 "Source code on GitHub"