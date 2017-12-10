import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import PropTypes from 'prop-types';

class SockJsClient extends React.Component {

  static defaultProps = {
    debug: false,
    onConnect: () => {}
  }
  
  static propTypes = {
    url: PropTypes.string.isRequired,
    debug: PropTypes.bool,
    topics: PropTypes.array.isRequired,
    onConnect: propTypes.func,
    onMessage: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.client = Stomp.overWS(new SockJS(this.props.url));
    this.subscriptions = new Map();

    this.state = {
      connected: false
    }
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.topics.forEach((topic) => {
      this.unsubscribe(topic);
    });
  }

  render() {
    return (<div></div>);
  }

  connect = () => {
    this.client.connect({}, () => {
      this.setState({ connected: true });
      this.props.topics.forEach((topic) => {
        subscribe(topic);
      });
    });
  }

  subscribe = (topic) => {
    let sub = this.client.subscribe(topic, (msg) => {
      this.props.onMessage(msg);
    });
    this.subscriptions.set(topic, sub);
  }

  unsubscribe = (topic) => {
    let sub = this.subscriptions.get(topic);
    sub.unsubscribe();
    this.subscriptions.delete(topic);
  }

  // Will be accessed by ref attribute from the parent component
  sendMessage = (topic, msg) => {
    if (!this.subscriptions.has(topic)) {
      throw 'Not subscribed to the given topic';
    } else {
      this.client.send(topic, {}, msg);
    }
  }
}

export default SockJsClient;
