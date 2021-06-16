import { css, html, internalProperty, property, PropertyValues, query } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { Literal, NamedNode, Quad } from 'n3';
import { BaseComponent } from './base.component';

export default class InputComponent extends BaseComponent {

  /**
   * The input field.
   */
  @query('#content')
  content: HTMLInputElement;
  @query('#fileName')
  fileName: HTMLInputElement;

  @internalProperty()
  showAlert = false;

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

    this.content.disabled = false;
    this.fileName.disabled = false;
    this.button.disabled = false;

    if (event.detail.success) {

      this.content.value = '';
      this.fileName.value = '';

    } else{

      this.showAlert = true;

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

        .alert {
          padding: 15px;
          background-color: #f44336;
          color: white;
          margin-bottom: 15px;
        }

        .alert.hidden {
          visibility: hidden;      
        }
        
        .dismiss {
          margin-left: 15px;
          color: white;
          font-weight: bold;
          float: right;
          font-size: 22px;
          line-height: 20px;
          cursor: pointer;
          transition: 0.3s;
        }

      `,
    ];

  }

  /**
   * Writes data when the user clicks the submit button.
   */
  handleClickSubmit() {

    let location = this.entry;

    if (this.fileName?.value) {

      location = this.fileName.value;

    }

    if (!this.content) {

      throw new Error('Argument this.inputField should be set.');

    }

    this.content.disabled = true;
    this.fileName.disabled = true;
    this.button.disabled = true;
    this.showAlert = false;

    const data = [ new Quad(new NamedNode(location), new NamedNode('https://digita.ai/voc/foo/bar'), new Literal(this.content.value)) ];
    this.writeData(location, data);

  }

  toggleAlert() {

    this.showAlert = false;

  }

  render() {

    return html`
    <div class="container">
      <div class="alert ${this.showAlert ? '' : 'hidden'}" id="alert">
        <span class="dismiss" @click="${this.toggleAlert}">&times;</span> 
        Something went wrong while saving.
      </div>
      <label for="fileName">File Location: (defaults to ${this.entry})</label>
      <input id="fileName" type="text" name="fileName"/>
      <label for="content">Content:</label>
      <input id="content" type="text" name="content"/>
      <button @click="${this.handleClickSubmit}" type="submit">Submit</button>
    </div>
  `;

  }

}
