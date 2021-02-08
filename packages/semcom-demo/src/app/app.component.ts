import { Component } from '@angular/core';
// import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `
    <div>{{ 'HELLO' | translate:param }}</div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'semcom-demo';
  param = {value: 'world'};

  constructor(/* translator: TranslateService */) {
    // translator.setDefaultLang('en');
    // translator.use('nl');
  }

}
