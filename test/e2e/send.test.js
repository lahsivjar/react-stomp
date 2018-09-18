import React from "react";
import { mount, shallow } from "enzyme";
import { expect } from "chai";
import SockJsClient from "../../src/client.jsx";

describe("<SockJsClient /> -> sendMessage", () => {
  it("Ping and pong", (done) => {
    const messageContainer = [];
    const onMessageHandler = (msg) => {
      messageContainer.push(msg);
    };

    const mountedComponent = mount(<SockJsClient url="http://localhost:8089/handler"
      topics={["/topic/ping"]} onMessage={ onMessageHandler } />);

    setTimeout(() => {
      mountedComponent.instance().sendMessage("/app/ping", "ping");
      validateSend();
    }, 500);

    const validateSend = () => {
      setTimeout(() => {
        expect(messageContainer).to.deep.include({ "msg": "pong" });
        mountedComponent.unmount();
        done();
      }, 500);
    };
  });

  it("Ping me and I pong you", (done) => {
    const messageContainer = [];
    const onMessageHandler = (msg) => {
      messageContainer.push(msg);
    };

    const reciever = mount(<SockJsClient url="http://localhost:8089/handler"
      topics={["/topic/ping"]} onMessage={ onMessageHandler } />);

    const sender = mount(<SockJsClient url="http://localhost:8089/handler"
      topics={[]} onMessage={ (msg) => { console.log(msg); } } />);

    setTimeout(() => {
      sender.instance().sendMessage("/app/ping", "ping");
      validateSend();
    }, 500);

    const validateSend = () => {
      setTimeout(() => {
        expect(messageContainer).to.deep.include({ "msg": "pong" });
        sender.unmount();
        reciever.unmount();
        done();
      }, 500);
    };
  });
});
