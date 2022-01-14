import { css, CSSResult, html, query, state, TemplateResult } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { Literal, NamedNode, Quad } from 'n3';
import { ComponentDataTypes } from '@digita-ai/semcom-core';
import { BaseComponent } from './base.component';

export class InputComponent extends BaseComponent {

  /**
   * The input field.
   */
  @query('#content')
  content?: HTMLInputElement;
  @query('#fileName')
  fileName?: HTMLInputElement;

  @state()
  showAlert = false;

  @state()
  success?: boolean;

  /**
   * The slot element which contains the input field.
   */
  @query('button')
  button?: HTMLButtonElement;

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse<D extends keyof ComponentDataTypes>(event: ComponentResponseEvent<D>): void {

    if (!event) {

      throw new Error('Argument event should be set.');

    }

    if(this.content && this.fileName && this.button) {

      this.content.disabled = false;
      this.fileName.disabled = false;
      this.button.disabled = false;

      if (event.detail.success) {

        this.content.value = '';
        this.fileName.value = '';
        this.success = true;

      } else {

        this.success = false;

      }

    }

    this.showAlert = true;

  }

  static get styles(): CSSResult[] {

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

        button:disabled, button[disabled]{
          background-color: #cccccc !important;
          color: #666666;
          cursor: default;
        }
        
        button[type=submit]:hover {
          background-color: #45a049;
        }

        .alert {
          padding: 15px;
          color: white;
          margin-bottom: 15px;
        }

        .alert.hidden {
          visibility: hidden;      
        }

        .alert.danger {
          background-color: #f44336;
        }

        .alert.success {
          background-color: #45a049
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
  handleClickSubmit(): void {

    if (!this.fileName) {

      throw new Error('Argument this.fileName should be set.');

    }

    if (!this.content) {

      throw new Error('Argument this.content should be set.');

    }

    if(this.content && this.fileName && this.button) {

      this.button.disabled = true;
      this.content.disabled = true;
      this.fileName.disabled = true;

    }

    this.showAlert = false;

    const data = [ new Quad(new NamedNode(this.fileName.value), new NamedNode('https://digita.ai/voc/foo/bar'), new Literal(this.content.value)) ];
    this.writeData(this.fileName.value, data, 'quads');

  }

  render(): TemplateResult {

    return html`
    <div class="container">
      <div class="alert ${this.showAlert ? '' : 'hidden'}  ${this.success ? 'success' : 'danger'}" id="alert">
        <span class="dismiss" @click="${() => this.showAlert = false}">&times;</span> 
        ${this.success ? 'Successfully saved content to file.' : 'Something went wrong while saving.'} 
      </div>
      <label for="fileName">File Location:</label>
      <input id="fileName" type="text" name="fileName"/>
      <label for="content">Content:</label>
      <input id="content" type="text" name="content"/>
      <button @click="${this.handleClickSubmit}" type="submit">Submit</button>
    </div>
  `;

  }

}

export default InputComponent;
