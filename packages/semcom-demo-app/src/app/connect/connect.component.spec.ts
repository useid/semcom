import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { declarations, imports, providers } from '../app.module';
import { ConnectComponent } from './connect.component';

describe('ConnectComponent', () => {

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
        ConnectComponent,
        ...declarations,
      ],
    }).compileComponents();

  });

  it('should create the component', () => {

    const fixture = TestBed.createComponent(ConnectComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();

  });

});
