import React from "react";
import sinon from "sinon";
import { mount, shallow } from "enzyme";
import { expect } from "chai";

import SockJsClient from "../../src/client.jsx";

const clientTypes = {
  onlyRequired: <SockJsClient url="http://thisisfakewsurl/ws" topics={["/topics/all"]}
    onMessage={(msg) => { console.log(msg); }} />,
  withDebug: <SockJsClient url="http://thisisfakewsurl/ws" topics={["/topics/all"]}
    debug={ true } onMessage={(msg) => { console.log(msg); }} />
};

describe("<SockJsClient />", () => {
  it("Renders null with only required props", () => {
    const wrapper = shallow(clientTypes.onlyRequired);
    expect(wrapper.getElement()).to.be.null;
    wrapper.unmount();
  });

  it("Renders null with additional debug prop", () => {
    const wrapper = shallow(clientTypes.withDebug);
    expect(wrapper.getElement()).to.be.null;
    wrapper.unmount();
  });
  it("Connect is called once", () => {
    const connectSpy = sinon.spy(SockJsClient.prototype, "componentDidMount");
    const mountedComponent = mount(clientTypes.onlyRequired);
    expect(connectSpy.calledOnce).to.be.true;
    connectSpy.restore();
    mountedComponent.unmount();
  });

  it("Connection is closed on unmount", () => {
    const disconnectSpy = sinon.spy(SockJsClient.prototype, "componentWillUnmount");
    const mountedComponent = mount(clientTypes.onlyRequired);
    mountedComponent.unmount();
    expect(disconnectSpy.calledOnce).to.be.true;
    disconnectSpy.restore();
  });

  it("Attempt reconnect on bad connection", () => {
    const retryIntervalFunc = sinon.fake.returns(100);
    const mountedComponent = mount(<SockJsClient url="http://thisisfakewsurl/ws" topics={["/topics/all"]}
      debug={ true } onMessage={(msg) => { console.log(msg); }} getRetryInterval={ retryIntervalFunc } />);

    setTimeout(() => {
      expect(retryIntervalFunc.calledTwice).to.be.true;
    }, 210);
  });

  it("Send without connect should throw error", () => {
    const mountedComponent = mount(<SockJsClient url="http://thisisfakewsurl/ws" topics={["/topics/all"]}
      debug={ true } onMessage={(msg) => { console.log(msg); }} />);
    const client = mountedComponent.instance();
    expect(() => { client.sendMessage("/app/all", "i will fail"); }).to.throw("Send error: SockJsClient is disconnected");
  });
});
