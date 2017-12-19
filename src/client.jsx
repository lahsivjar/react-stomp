import React from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PropTypes from "prop-types";

class SockJsClient extends React.Component {

  static defaultProps = {
    onConnect: () => {},
    onDisconnect: () => {},
    headers: {},
    autoReconnect: true,
    debug: false
  }
  
  static propTypes = {
    url: PropTypes.string.isRequired,
    topics: PropTypes.array.isRequired,
    onConnect: PropTypes.func,
    onDisconnect: PropTypes.func,
    onMessage: PropTypes.func.isRequired,
    headers: PropTypes.object,
    autoReconnect: PropTypes.bool,
    debug: PropTypes.bool
  }

  constructor(props) {
    super(props);
    if (!this.props.debug) {
      this.client.debug = () => {};
    }

    this.state = {
      connected: false
    };

    this.subscriptions = new Map();
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    let subscribeTopics = this.subscriptions.keys();
    this.subscribeTopics.forEach((topic) => {
      this.unsubscribe(topic);
    });
  }

  render() {
    return (<div></div>);
  }

  connect = () => {
    // Websocket held by stompjs can be opened only once
    this.client = Stomp.over(new SockJS(this.props.url));
    this.client.connect(this.props.headers, () => {
      this.setState({ connected: true });
      if (this.periodicPoller) {
        this.periodicPoller = clearInterval(this.periodicPoller);
      }
      this.props.topics.forEach((topic) => {
        this.subscribe(topic);
      });
      this.props.onConnect();
    }, (error) => {
      if (this.state.connected) {
        this._cleanUp();
        this.periodicPoller = setInterval(this.connect, 5000);
        // onDisconnect should be called only once per connect
        this.props.onDisconnect();
      }
    });
  }

  _cleanUp = () => {
    this.setState({ connected: false });
    this.subscriptions.clear();
  }

  subscribe = (topic) => {
    let sub = this.client.subscribe(topic, (msg) => {
      this.props.onMessage(JSON.parse(msg.body));
    });
    this.subscriptions.set(topic, sub);
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
