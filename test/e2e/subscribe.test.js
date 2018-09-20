/* eslint-disable no-unused-expressions */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import SockJsClient from '../../src/client.jsx'

describe('<SockJsClient /> -> subscribe', () => {
  it('Subscribe to topic', (done) => {
    const mountedComponent = mount(<SockJsClient url='http://localhost:8089/handler'
      topics={[]} onMessage={(msg) => { console.log(msg) }} />)

    mountedComponent.setProps({ topics: ['/topic/all'] })

    setTimeout(() => {
      expect(mountedComponent.instance().subscriptions.size).to.equal(1)
      expect(mountedComponent.instance().subscriptions.has('/topic/all')).to.be.true
      addSubscription()
    }, 500)

    const addSubscription = () => {
      mountedComponent.setProps({ topics: ['/topic/all', '/topic/1'] })
      setTimeout(() => {
        expect(mountedComponent.instance().subscriptions.size).to.equal(2)
        expect(mountedComponent.instance().subscriptions.has('/topic/1')).to.be.true
        mountedComponent.unmount()
        done()
      }, 500)
    }
  })

  it('Unsubscribe from topic', (done) => {
    const mountedComponent = mount(<SockJsClient url='http://localhost:8089/handler'
      topics={['/topic/all', '/topic/1']} onMessage={(msg) => { console.log(msg) }} />)

    setTimeout(() => {
      expect(mountedComponent.instance().subscriptions.size).to.equal(2)
      removeSubscription()
    }, 500)

    const removeSubscription = () => {
      mountedComponent.setProps({ topics: ['/topic/all'] })
      setTimeout(() => {
        expect(mountedComponent.instance().subscriptions.size).to.equal(1)
        expect(mountedComponent.instance().subscriptions.has('/topic/all')).to.be.true
        mountedComponent.unmount()
        done()
      }, 500)
    }
  })

  it('Subscribe and unsubscibe mayhem', (done) => {
    const mountedComponent = mount(<SockJsClient url='http://localhost:8089/handler'
      topics={['/topic/all', '/topic/1']} onMessage={(msg) => { console.log(msg) }} />)

    setTimeout(() => {
      expect(mountedComponent.instance().subscriptions.size).to.equal(2)
      updateSubscription()
    }, 500)

    const updateSubscription = () => {
      // Subscribe to '/topic/2' and unsubscribe from '/topic/1'
      mountedComponent.setProps({ topics: ['/topic/all', '/topic/2'] })
      setTimeout(() => {
        expect(mountedComponent.instance().subscriptions.size).to.equal(2)
        expect(mountedComponent.instance().subscriptions.has('/topic/all')).to.be.true
        expect(mountedComponent.instance().subscriptions.has('/topic/2')).to.be.true
        mountedComponent.unmount()
        done()
      }, 500)
    }
  })
})
