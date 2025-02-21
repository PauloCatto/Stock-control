import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

describe('AppComponent', () => {
  let component: AppComponent;
  let primengConfigMock: jasmine.SpyObj<PrimeNGConfig>;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    primengConfigMock = jasmine.createSpyObj('PrimeNGConfig', [
      'setTranslation',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastModule],
      declarations: [AppComponent],
      providers: [
        { provide: PrimeNGConfig, useValue: primengConfigMock },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set ripple to true and configure translations on ngOnInit', () => {
    fixture.detectChanges();

    expect(primengConfigMock.ripple).toBeTrue();
    expect(primengConfigMock.setTranslation).toHaveBeenCalledWith({
      apply: 'Aplicar',
      clear: 'Limpar',
    });
  });
});
