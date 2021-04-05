export default class ExampleComponent extends HTMLElement {
    object = 'NOT_LOADED';
    shadowRoot;
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }
}
