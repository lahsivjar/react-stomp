import React from "react";
import { mount, shallow } from "enzyme";
import { expect } from "chai";
import SockJsClient from "../../src/client.jsx";

describe("<SockJsClient /> -> connect", () => {
  it("Websocket is connected", (done) => {
    const mountedComponent = mount(<SockJsClient url="http://localhost:8089/handler"
      topics={["/topic/all"]} onMessage={(msg) => { console.log(msg); }} />);

    setTimeout(() => {
      expect(mountedComponent.state().connected).to.be.true;
      mountedComponent.unmount();
      done();
    }, 500);
  });

  it("Websocket is disconnected", (done) => {
    var clientRef = null;
    const mountedComponent = mount(<SockJsClient url="http://localhost:8089/handler"
      topics={["/topic/all"]} ref={(client) => { clientRef = client; }}
      onMessage={(msg) => { console.log(msg); }} />);

    setTimeout(() => {
      expect(mountedComponent.state().connected).to.be.true;
      mountedComponent.instance().disconnect();
      verifyDisconnect();
    }, 500);

    const verifyDisconnect = () => {
      setTimeout(() => {
        expect(mountedComponent.state().connected).to.be.false;
        expect(mountedComponent.instance().subscriptions.size).to.equal(0);
        mountedComponent.unmount();
        done();
      }, 100);
    };
  });
});
