import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'demo-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent {

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
