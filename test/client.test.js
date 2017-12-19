import React from "react";
import sinon from "sinon";
import { mount } from "enzyme";
import { expect } from "chai";

import SockJsClient from "../src/client.jsx";

const clientTypes = {
  onlyRequired: <SockJsClient url="http://localhost:8080/ws" topics={["/topics/all"]}
    onMessage={(msg) => { console.log(msg); }} />,
  withDebug: <SockJsClient url="http://localhost:8080/ws" topics={["/topics/all"]}
    debug={ true } onMessage={(msg) => { console.log(msg); }} />
};

describe("<SockJsClient />", () => {
  it("Renders a div with only required props", () => {
    const mountedComponent = mount(clientTypes.onlyRequired);
    expect(mountedComponent.find("div").length).to.equal(1);
    mountedComponent.unmount();
  });

  it("Renders a div with additional debug prop", () => {
    const mountedComponent = mount(clientTypes.withDebug);
    expect(mountedComponent.find("div").length).to.equal(1);
    mountedComponent.unmount();
  });

  it("Connect is called once", () => {
    const connectSpy = sinon.spy(SockJsClient.prototype, "componentDidMount");
    const mountedComponent = mount(clientTypes.onlyRequired);
    expect(connectSpy.calledOnce).to.be.true;
    connectSpy.restore();
    mountedComponent.unmount();
  });
});
