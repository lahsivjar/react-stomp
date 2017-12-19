import jsdom from "jsdom";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

const { JSDOM } = jsdom;
const { document } = (new JSDOM("<!doctype html><html><body></body></html>")).window;

global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;

Enzyme.configure({ adapter: new Adapter() });

