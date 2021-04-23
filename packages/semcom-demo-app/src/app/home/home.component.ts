import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Component as SemComComponent } from '@digita-ai/semcom-core';
import { Store } from '@ngrx/store';
import { fetch } from '@inrupt/solid-client-authn-browser';
import { connectWebIdSelector } from '../connect/connect.state';
import { homeComponentsSelector } from './home.state';
import { homePageInit } from './home.actions';

@Component({
  selector: 'demo-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ],
})
export class HomeComponent implements OnInit {

  @ViewChild('components', { read: ElementRef }) container: ElementRef;

  webid$: Observable<string | undefined> = this.store.select(connectWebIdSelector);
  components$: Observable<string[]> = this.store.select<string[]>(homeComponentsSelector);

  constructor(private store: Store, private renderer: Renderer2) {}

  ngOnInit(): void {

    combineLatest([ this.webid$, this.components$ ]).subscribe(([ webid, tags ]) => {
      if (webid) {
        tags.forEach((tag) => {
          const element = this.renderer.createElement(tag) as SemComComponent;
          element.data(webid, fetch);
          this.renderer.appendChild(this.container.nativeElement, element);
        });
      }
    });

    this.store.dispatch(homePageInit());

  }

}
