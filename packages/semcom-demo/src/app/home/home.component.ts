import { Component } from '@angular/core';

@Component({
  selector: 'demo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  name: string | undefined;

  sayHi(name: string): void {
    this.name = name;
  }

}
