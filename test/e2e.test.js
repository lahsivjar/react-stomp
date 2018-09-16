import React from "react";
import sinon from "sinon";
import SockJS from "sockjs-client";
import { mount, shallow } from "enzyme";
import { expect } from "chai";
import SockJsClient from "../src/client.jsx";

describe("<SockJsClient />", () => {
  it("Websocket is connected", (done) => {
    const mountedComponent = mount(<SockJsClient url="http://localhost:8089/handler" topics={["/topics/all"]}
      debug={ true } onMessage={(msg) => { console.log(msg); }} autoReconnect={ false }/>);

    setTimeout(() => {
      expect(mountedComponent.state().connected).to.be.true;
      mountedComponent.unmount();
      done();
    }, 1000);
  });
});
