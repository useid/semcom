import { css, html, property, PropertyValues, query } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { Literal, NamedNode, Quad } from 'n3';
import { BaseComponent } from './base.component';

export default class InputComponent extends BaseComponent {

  /**
   * The input field.
   */
  @query('input')
  input: HTMLInputElement;

  /**
   * The slot element which contains the input field.
   */
  @query('button')
  button: HTMLButtonElement;

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse(event: ComponentResponseEvent): void {

    if (!event) {

      throw new Error('Argument event should be set.');

    }

    this.input.disabled = false;
    this.button.disabled = false;

    if (event.detail.success) {

      this.input.value = '';

    }

  }

  static get styles() {

    return [
      css`
        :host {
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
        }
        .container {
          width: 100%;
          text-align: center;
          padding: 40px 0;
        }

        input[type=text], select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        button {
          width: 100%;
          background-color: #4CAF50;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button[type=submit]:hover {
          background-color: #45a049;
        }

      `,
    ];

  }

  /**
   * Writes data when the user clicks the submit button.
   */
  handleClickSubmit() {

    if (!this.entry) {

      throw new Error('Argument this.entry should be set.');

    }

    if (!this.input) {

      throw new Error('Argument this.inputField should be set.');

    }

    this.input.disabled = true;
    this.button.disabled = true;

    const data = [ new Quad(new NamedNode(this.entry), new NamedNode('https://digita.ai/voc/foo/bar'), new Literal(this.input.value)) ];

    this.writeData(this.entry, data);

  }

  render() {

    return html`
    <div class="container">
      <label for="name">Your Input:</label>
      <br>
      <input type="text" />
      <br>
      <button @click="${this.handleClickSubmit}" type="submit">Submit</button>
    </div>
  `;

  }

}
