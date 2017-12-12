# react-stomp

React component for [SockJS-client](https://github.com/sockjs/sockjs-client) with [STOMP](https://stomp.github.io/) messaging protocol.

## Installation

```
npm install --save react-stomp
```

## Example Usage

```
import React from 'react';
import SockJsClient from 'react-stomp';

class SampleComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SockJsClient url='http://localhost:8080/ws' topics={['/topics/all']}
            onMessage={(msg) => { console.log(msg); }} />
      </div>
    );
  }
}
```

## API

* `url`: HTTP URL of the websocket endpoint to connect
* `topics`: An array of topics to subscribe
* `onMessage`: Callback when a message is recieved
* `onConnect`: Callback after connection is established

## Issues

Report any issues or bugs to https://github.com/lahsivjar/react-stomp/issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
