import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  translator: TranslateService;
  name: string | undefined;

  constructor(translator: TranslateService) {
    this.translator = translator;
    this.translator.setDefaultLang('en');
    this.translator.use('en');
  }

  setLang(lang: string): void {
    this.translator.use(lang);
  }

  sayHi(name: string): void {
    this.name = name;
  }

}
