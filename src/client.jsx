import React from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PropTypes from "prop-types";
import Lo from "lodash";

class SockJsClient extends React.Component {

  static defaultProps = {
    onConnect: () => {},
    onDisconnect: () => {},
    getRetryInterval: (count) => {return 1000 * count;},
    headers: {},
    subscribeHeaders: {},
    autoReconnect: true,
    debug: false
  }

  static propTypes = {
    url: PropTypes.string.isRequired,
    topics: PropTypes.array.isRequired,
    onConnect: PropTypes.func,
    onDisconnect: PropTypes.func,
    getRetryInterval: PropTypes.func,
    onMessage: PropTypes.func.isRequired,
    headers: PropTypes.object,
    subscribeHeaders: PropTypes.object,
    autoReconnect: PropTypes.bool,
    debug: PropTypes.bool,
    heartbeat: PropTypes.number,
    heartbeatIncoming: PropTypes.number,
    heartbeatOutgoing: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      connected: false
    };

    this.subscriptions = new Map();
    this.retryCount = 0;
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.connected) {
      // Subscribe to new topics
      Lo.difference(nextProps.topics, this.props.topics)
        .forEach((newTopic) => {
          this._log("Subscribing to topic: " + newTopic);
          this.subscribe(newTopic);
        });

      // Unsubscribe from old topics
      Lo.difference(this.props.topics, nextProps.topics)
        .forEach((oldTopic) => {
          this._log("Unsubscribing from topic: " + oldTopic);
          this.unsubscribe(oldTopic);
        });
    }
  }

  render() {
    return (<div></div>);
  }

  _initStompClient = () => {
    // Websocket held by stompjs can be opened only once
    this.client = Stomp.over(new SockJS(this.props.url));
    if (this.props.heartbeat) {
      this.client.heartbeat.outgoing = this.props.heartbeat;
      this.client.heartbeat.incoming = this.props.heartbeat;
    }
    if (Object.keys(this.props).includes('heartbeatIncoming')) {
      this.client.heartbeat.incoming = this.props.heartbeatIncoming;
    }
    if (Object.keys(this.props).includes('heartbeatOutgoing')) {
      this.client.heartbeat.outgoing = this.props.heartbeatOutgoing;
    }
    if (!this.props.debug) {
      this.client.debug = () => {};
    }
  }

  _cleanUp = () => {
    this.setState({ connected: false });
    this.retryCount = 0;
    this.subscriptions.clear();
  }

  _log = (msg) => {
    if (this.props.debug) {
      console.log(msg);
    }
  }

  connect = () => {
    this._initStompClient();
    this.client.connect(this.props.headers, () => {
      this.setState({ connected: true });
      this.props.topics.forEach((topic) => {
        this.subscribe(topic);
      });
      this.props.onConnect();
    }, (error) => {
      if (this.state.connected) {
        this._cleanUp();
        // onDisconnect should be called only once per connect
        this.props.onDisconnect();
      }
      if (this.props.autoReconnect) {
        this._timeoutId = setTimeout(this.connect, this.props.getRetryInterval(this.retryCount++));
      }
    });
  }

  disconnect = () => {
    // On calling disconnect explicitly no effort will be made to reconnect
    // Clear timeoutId in case the component is trying to reconnect
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    if (this.state.connected) {
      this.subscriptions.forEach((subid, topic) => {
        this.unsubscribe(topic);
      });
      this.client.disconnect(() => {
        this._cleanUp();
        this.props.onDisconnect();
        this._log("Stomp client is successfully disconnected!");
      });
    }
  }

  subscribe = (topic) => {
    if (!this.subscriptions.has(topic)) {
      let sub = this.client.subscribe(topic, (msg) => {
        this.props.onMessage(JSON.parse(msg.body), topic);
      }, Lo.slice(this.props.subscribeHeaders));
      this.subscriptions.set(topic, sub);
    }
  }

  unsubscribe = (topic) => {
    let sub = this.subscriptions.get(topic);
    sub.unsubscribe();
    this.subscriptions.delete(topic);
  }

  // Below methods can be accessed by ref attribute from the parent component
  sendMessage = (topic, msg, opt_headers = {}) => {
    if (this.state.connected) {
      this.client.send(topic, opt_headers, msg);
    } else {
      console.error("Send error: SockJsClient is disconnected");
    }
  }
}

export default SockJsClient;
