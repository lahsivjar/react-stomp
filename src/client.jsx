import React from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PropTypes from "prop-types";

class SockJsClient extends React.Component {

  static defaultProps = {
    onConnect: () => {}
  }
  
  static propTypes = {
    url: PropTypes.string.isRequired,
    topics: PropTypes.array.isRequired,
    onConnect: PropTypes.func,
    onMessage: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.client = Stomp.over(new SockJS(this.props.url));
    this.subscriptions = new Map();

    this.state = {
      connected: false
    };
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
    this.client.connect({}, () => {
      this.setState({ connected: true });
      this.props.topics.forEach((topic) => {
        this.subscribe(topic);
      });
    });
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

  // Will be accessed by ref attribute from the parent component
  sendMessage = (topic, msg) => {
    this.client.send(topic, {}, msg);
  }
}

export default SockJsClient;
