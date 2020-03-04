# react-stomp

[![Build Status](https://travis-ci.com/lahsivjar/react-stomp.svg?branch=master)](https://travis-ci.com/lahsivjar/react-stomp?branch=master) [![Coverage Status](https://coveralls.io/repos/github/lahsivjar/react-stomp/badge.svg?branch=master)](https://coveralls.io/github/lahsivjar/react-stomp?branch=master) [![License](https://img.shields.io/npm/l/react-stomp.svg)](https://github.com/lahsivjar/react-stomp/blob/master/LICENSE) [![Greenkeeper badge](https://badges.greenkeeper.io/lahsivjar/react-stomp.svg)](https://greenkeeper.io/) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)

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

<https://react-websocket.herokuapp.com/index>

A working implementation using [Spring Boot](https://projects.spring.io/spring-boot/) and [react-talk](https://github.com/lahsivjar/react-talk) can be found at <https://github.com/lahsivjar/spring-websocket-template/tree/master/with-sockjs>

## API Docs

Auto generated docs available [here](API.md).

## Issues

Report any issues or bugs to <https://github.com/lahsivjar/react-stomp/issues>

## Changelog

### 5.0.0
- Update react from 16.5.0 to 16.6.3
- Fix deprecation of `componentWillReceiveProps`

### 4.3.0
- Update handlebar dependency

### 4.2.0

- Add `onConnectFailure` callback
- Upgrade babel to babel7

### 4.1.1

- [BugFix #96] Remove array slice of subscribe headers

### 4.1.0

- Update react from 16.5.0 to 16.6.3
- Update react-dom from 16.5.0 to 16.6.3
- [PR #93] Use STOMP message frame to find correct topic

### 4.0.0

-   Improve test coverage
-   [BugFix #61] Add support for receiving plain text messages
-   [BugFix #70] Fix reconnect loop under certain circumstances even after disconnect is called

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
