import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { homeComponentsSelector } from './home.state';
import { homePageInit } from './home.actions';

@Component({
  selector: 'demo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  components$: Observable<string[]> = this.store.select<string[]>(homeComponentsSelector);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(homePageInit());
  }

}
