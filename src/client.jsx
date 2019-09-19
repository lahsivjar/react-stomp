import React from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import PropTypes from 'prop-types'
import Lo from 'lodash'

/**
 * React component for SockJS-client with STOMP messaging protocol.
 *
 * @version 4.1.0
 * @author [lahsivjar] (https://github.com/lahsivjar)
 * @see {@link https://stomp.github.io/|STOMP}
 * @see {@link https://github.com/sockjs/sockjs-client|StompJS}
 */
class SockJsClient extends React.Component {
  static defaultProps = {
    onConnect: () => {},
    onDisconnect: () => {},
    getRetryInterval: (count) => { return 1000 * count },
    options: {},
    headers: {},
    subscribeHeaders: {},
    autoReconnect: true,
    debug: false,
    heartbeat: 10000
  }

  static propTypes = {
    /**
     * HTTP URL of the endpoint to connect.
     */
    url: PropTypes.string.isRequired,
    /**
     * Additional options to pass to the underlying SockJS constructor.
     *
     * @see [SockJS-options](https://github.com/sockjs/sockjs-client#sockjs-client-api)
     */
    options: PropTypes.object,
    /**
     * Array of topics to subscribe to.
     */
    topics: PropTypes.array.isRequired,
    /**
     * Callback after connection is established.
     */
    onConnect: PropTypes.func,
    /**
     * Callback after connection is lost.
     */
    onDisconnect: PropTypes.func,
    /**
     * Gets called to find the time interval for next retry. Defaults to a function returing retryCount seconds.
     *
     * @param {number} retryCount number of retries for the current disconnect
     */
    getRetryInterval: PropTypes.func,
    /**
     * Callback when a message is recieved.
     *
     * @param {(string|Object)} msg message received from server, if JSON format then object
     * @param {string} topic the topic on which the message was received
     */
    onMessage: PropTypes.func.isRequired,
    /**
     * Headers that will be passed to the server or broker with STOMP's connection frame.
     */
    headers: PropTypes.object,
    /**
     * Headers that will be passed when subscribing to a destination.
     */
    subscribeHeaders: PropTypes.object,
    /**
     * Should the client try to automatically connect in an event of disconnection.
     */
    autoReconnect: PropTypes.bool,
    /**
     * Enable debugging mode.
     */
    debug: PropTypes.bool,
    /**
     * Number of milliseconds to send and expect heartbeat messages.
     */
    heartbeat: PropTypes.number,
    /**
     * Number of milliseconds to expect heartbeat messages
     */
    heartbeatIncoming: PropTypes.number,
    /**
     * Number of milliseconds to send heartbeat messages
     */
    heartbeatOutgoing: PropTypes.number,
    /**
     * Callback if connection could not be established
     */
    onConnectFailure: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      connected: false,
      // False if disconnect method is called without a subsequent connect
      explicitDisconnect: false
    }

    this.subscriptions = new Map()
    this.retryCount = 0
  }

  componentDidMount () {
    this._connect()
  }

  componentWillUnmount () {
    this.disconnect()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.connected) {
      // Subscribe to new topics
      Lo.difference(nextProps.topics, this.props.topics)
        .forEach((newTopic) => {
          this._log('Subscribing to topic: ' + newTopic)
          this._subscribe(newTopic)
        })

      // Unsubscribe from old topics
      Lo.difference(this.props.topics, nextProps.topics)
        .forEach((oldTopic) => {
          this._log('Unsubscribing from topic: ' + oldTopic)
          this._unsubscribe(oldTopic)
        })
    }
  }

  render () {
    return null
  }

  _initStompClient = () => {
    // Websocket held by stompjs can be opened only once
    this.client = Stomp.over(new SockJS(this.props.url, null, this.props.options))

    this.client.heartbeat.outgoing = this.props.heartbeat
    this.client.heartbeat.incoming = this.props.heartbeat

    if (Object.keys(this.props).includes('heartbeatIncoming')) {
      this.client.heartbeat.incoming = this.props.heartbeatIncoming
    }
    if (Object.keys(this.props).includes('heartbeatOutgoing')) {
      this.client.heartbeat.outgoing = this.props.heartbeatOutgoing
    }
    if (!this.props.debug) {
      this.client.debug = () => {}
    }
  }

  _cleanUp = () => {
    this.setState({ connected: false })
    this.retryCount = 0
    this.subscriptions.clear()
  }

  _log = (msg) => {
    if (this.props.debug) {
      console.log(msg)
    }
  }

  _subscribe = (topic) => {
    if (!this.subscriptions.has(topic)) {
      let sub = this.client.subscribe(topic, (msg) => {
        this.props.onMessage(this._processMessage(msg.body), msg.headers.destination)
      }, this.props.subscribeHeaders)
      this.subscriptions.set(topic, sub)
    }
  }

  _processMessage = (msgBody) => {
    try {
      return JSON.parse(msgBody)
    } catch (e) {
      return msgBody
    }
  }

  _unsubscribe = (topic) => {
    let sub = this.subscriptions.get(topic)
    sub.unsubscribe()
    this.subscriptions.delete(topic)
  }

  _connect = () => {
    this._initStompClient()
    this.client.connect(this.props.headers, () => {
      this.setState({ connected: true })
      this.props.topics.forEach((topic) => {
        this._subscribe(topic)
      })
      this.props.onConnect()
    }, (error) => {
      if (error) {
        if (Object.keys(this.props).includes('onConnectFailure')) {
          this.props.onConnectFailure(error)
        } else {
          this._log(error.stack)
        }
      }
      if (this.state.connected) {
        this._cleanUp()
        // onDisconnect should be called only once per connect
        this.props.onDisconnect()
      }
      if (this.props.autoReconnect && !this.state.explicitDisconnect) {
        this._timeoutId = setTimeout(this._connect, this.props.getRetryInterval(this.retryCount++))
      }
    })
  }

  /**
   * Connect to the server if not connected. Under normal circumstances component
   * will automatically try to connect to server. This method is mostly useful
   * after component is explicitly disconnected via {@link SockJsClient#disconnect}.
   *
   * @public
   */
  connect = () => {
    this.setState({ explicitDisconnect: false })
    if (!this.state.connected) {
      this._connect()
    }
  }

  /**
   * Disconnect STOMP client and disable all reconnect.
   *
   * @public
   */
  disconnect = () => {
    // On calling disconnect explicitly no effort will be made to reconnect
    // Clear timeoutId in case the component is trying to reconnect
    if (this._timeoutId) {
      clearTimeout(this._timeoutId)
      this._timeoutId = null
    }
    this.setState({ explicitDisconnect: true })
    if (this.state.connected) {
      this.subscriptions.forEach((subid, topic) => {
        this._unsubscribe(topic)
      })
      this.client.disconnect(() => {
        this._cleanUp()
        this.props.onDisconnect()
        this._log('Stomp client is successfully disconnected!')
      })
    }
  }

  /**
   * Send message to the specified topic.
   *
   * @param {string} topic target topic to send message
   * @param {string} msg message to send
   * @param {Object} [opt_headers={}] additional headers for underlying STOMP client
   * @public
   */
  sendMessage = (topic, msg, opt_headers = {}) => {
    if (this.state.connected) {
      this.client.send(topic, opt_headers, msg)
    } else {
      throw new Error('Send error: SockJsClient is disconnected')
    }
  }
}

export default SockJsClient
