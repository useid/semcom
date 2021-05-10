import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { declarations, imports, providers } from '../app.module';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ...imports,
      ],
      providers: [
        ...providers,
      ],
      declarations: [
        HomeComponent,
        ...declarations,
      ],
    }).compileComponents();

  });

  it('should create the component', () => {

    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();

  });

});
