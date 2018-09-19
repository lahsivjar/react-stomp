# react-stomp
[![Build Status](https://travis-ci.org/lahsivjar/react-stomp.svg?branch=master)](https://travis-ci.org/lahsivjar/react-stomp) [![Coverage Status](https://coveralls.io/repos/github/lahsivjar/react-stomp/badge.svg?branch=master)](https://coveralls.io/github/lahsivjar/react-stomp?branch=master) [![License](https://img.shields.io/npm/l/react-stomp.svg)](https://github.com/lahsivjar/react-stomp/blob/master/LICENSE) [![Greenkeeper badge](https://badges.greenkeeper.io/lahsivjar/react-stomp.svg)](https://greenkeeper.io/)

React component for [SockJS-client](https://github.com/sockjs/sockjs-client) with [STOMP](https://stomp.github.io/) messaging protocol.

## Installation

```sh
npm install --save react-stomp
```

## Example Usage

```jsx
import React from 'react';
import SockJsClient from 'react-stomp';

class SampleComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  sendMessage = (msg) => {
    this.clientRef.sendMessage('/topics/all', msg);
  }

  render() {
    return (
      <div>
        <SockJsClient url='http://localhost:8080/ws' topics={['/topics/all']}
            onMessage={(msg) => { console.log(msg); }}
            ref={ (client) => { this.clientRef = client }} />
      </div>
    );
  }
}
```

## Demonstration
https://react-websocket.herokuapp.com/index

A working implementation using [Spring Boot](https://projects.spring.io/spring-boot/) and [react-talk](https://github.com/lahsivjar/react-talk) can be found at https://github.com/lahsivjar/spring-websocket-template/tree/master/with-sockjs

## Parameters

* `url`: HTTP URL of the websocket endpoint to connect
* `topics`: An array of topics to subscribe
* `onMessage`: Callback when a message is recieved
* `onConnect`: Callback after connection is established
* `heartbeat`: Number of milliseconds to send and expect heartbeat messages
* `heartbeatIncoming`: Number of milliseconds to expect heartbeat messages
* `heartbeatOutgoing`: Number of milliseconds to send heartbeat messages
* `onDisconnect`: Callback after connection is lost
* `getRetryInterval`: Function property which takes a number parameter indicating the retry count for a particular disconnection and returns another number specifying the interval for next retry (will be ignored if auto reconnect is false, defaults to `retryCount` seconds)
* `headers`: Headers that will be passed to the server or broker with connection request
* `subscribeHeaders`: Headers that will be passed when subscribing to a destination
* `autoReconnect`: boolean indicating if retry should be attempted in an event of loosing connection (defaults to `true`)
* `debug`: Enable debugging mode (defaults to `false`)

## API

* `sendMessage(topic, msg, opt_headers)`: Send message to the specified topic
* `disconnect`: Disconnect STOMP client without any reconnection attempt
* `connect`: Try connecting to server (useful if `disconnect` is called explicitly before)

## Issues

Report any issues or bugs to https://github.com/lahsivjar/react-stomp/issues

## Changelog

### 4.0.0

- Improve test coverage
- [BugFix #61] Add support for receiving plain text messages
- [BugFix #70] Fix reconnect loop under certain circumstances even after disconnect is called

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
