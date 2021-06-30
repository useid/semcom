import { inspect } from '@xstate/inspect';
import { DemoComponent } from './demo.component';

/** Starts the xstate devtools in new window */
inspect({ iframe: false });

/** Register tags for components. */
customElements.define('demo-root', DemoComponent);
