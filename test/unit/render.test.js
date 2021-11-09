/* eslint-disable no-unused-expressions */

import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import SockJsClient from '../../src/client.jsx'

const clientTypes = {
  onlyRequired: <SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
    onMessage={(msg) => { console.log(msg) }} />,
  withDebug: <SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
    debug onMessage={(msg) => { console.log(msg) }} />,
  withAutoDecode: <SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
    autoDecode={false} onMessage={(msg) => { console.log(msg) }} />
}

describe('<SockJsClient />', () => {
  it('Renders null with only required props', () => {
    const wrapper = shallow(clientTypes.onlyRequired)
    expect(wrapper.getElement()).to.be.null
    wrapper.unmount()
  })

  it('Renders null with additional debug prop', () => {
    const wrapper = shallow(clientTypes.withDebug)
    expect(wrapper.getElement()).to.be.null
    wrapper.unmount()
  })

  it('Renders null with additional autoDecode prop', () => {
    const wrapper = shallow(clientTypes.withAutoDecode)
    expect(wrapper.getElement()).to.be.null
    wrapper.unmount()
  })

  it('Connect is called once', () => {
    const connectSpy = sinon.spy(SockJsClient.prototype, 'componentDidMount')
    const mountedComponent = mount(clientTypes.onlyRequired)
    expect(connectSpy.calledOnce).to.be.true
    connectSpy.restore()
    mountedComponent.unmount()
  })

  it('Connection is closed on unmount', () => {
    const disconnectSpy = sinon.spy(SockJsClient.prototype, 'componentWillUnmount')
    const mountedComponent = mount(clientTypes.onlyRequired)
    mountedComponent.unmount()
    expect(disconnectSpy.calledOnce).to.be.true
    disconnectSpy.restore()
  })

  it('Send without connect should throw error', () => {
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} />)
    const client = mountedComponent.instance()
    expect(() => { client.sendMessage('/app/all', 'i will fail') }).to.throw('Send error: SockJsClient is disconnected')
    mountedComponent.unmount()
  })

  it('Attempt reconnect on bad connection', (done) => {
    const retryIntervalFunc = sinon.fake.returns(100)
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} getRetryInterval={retryIntervalFunc} />)

    setTimeout(() => {
      expect(retryIntervalFunc.callCount).to.be.above(1)
      mountedComponent.unmount()
      done()
    }, 210)
  })

  it("On explicit disconnect don't try reconnect", (done) => {
    const retryIntervalFunc = sinon.fake.returns(20)
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} getRetryInterval={retryIntervalFunc} />)
    const connectSpy = sinon.spy(mountedComponent.instance(), '_connect')

    setTimeout(() => {
      mountedComponent.instance().disconnect()
      const reconnectCount = connectSpy.callCount
      expect(reconnectCount).to.be.above(1)
      validateDisconnect(reconnectCount)
    }, 110)

    const validateDisconnect = (reconnectCount) => {
      setTimeout(() => {
        expect(connectSpy.callCount).to.equal(reconnectCount)
        mountedComponent.unmount()
        done()
      }, 110)
    }
  })

  it('On explicit disconnect -> connect, try reconnect', (done) => {
    const retryIntervalFunc = sinon.fake.returns(20)
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} getRetryInterval={retryIntervalFunc} />)

    setTimeout(() => {
      mountedComponent.instance().disconnect()
      connectBack()
    }, 110)

    const connectBack = () => {
      setTimeout(() => {
        const connectSpy = sinon.spy(mountedComponent.instance(), '_connect')
        expect(connectSpy.callCount).to.equal(0)
        mountedComponent.instance().connect()
        validateReconnect(connectSpy)
      }, 110)
    }

    const validateReconnect = (connectSpy) => {
      setTimeout(() => {
        expect(connectSpy.callCount).to.be.above(1)
        mountedComponent.unmount()
        done()
      }, 110)
    }
  })

  it('No reconnection with auto reconnect false', (done) => {
    const retryIntervalFunc = sinon.fake.returns(10)
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} getRetryInterval={retryIntervalFunc} autoReconnect={false} />)

    setTimeout(() => {
      expect(retryIntervalFunc.notCalled).to.be.true
      mountedComponent.unmount()
      done()
    }, 110)
  })

  it('Asserting heartbeat default', () => {
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} />)
    expect(mountedComponent.instance().client.heartbeat.outgoing).to.equal(10000)
    expect(mountedComponent.instance().client.heartbeat.incoming).to.equal(10000)
  })

  it('Asserting heartbeat override', () => {
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} heartbeat={12345} />)
    expect(mountedComponent.instance().client.heartbeat.outgoing).to.equal(12345)
    expect(mountedComponent.instance().client.heartbeat.incoming).to.equal(12345)
  })

  it('Asserting heartbeat incoming override', () => {
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} heartbeatIncoming={23456} />)
    expect(mountedComponent.instance().client.heartbeat.outgoing).to.equal(10000)
    expect(mountedComponent.instance().client.heartbeat.incoming).to.equal(23456)
  })

  it('Asserting heartbeat outgoing override', () => {
    const mountedComponent = mount(<SockJsClient url='http://thisisfakewsurl/ws' topics={['/topics/all']}
      debug={false} onMessage={(msg) => { console.log(msg) }} heartbeatOutgoing={23456} />)
    expect(mountedComponent.instance().client.heartbeat.outgoing).to.equal(23456)
    expect(mountedComponent.instance().client.heartbeat.incoming).to.equal(10000)
  })
})
