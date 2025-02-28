import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormBuilder } from '@angular/forms';
import { UserService } from './../../services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let cookieServiceMock: jasmine.SpyObj<CookieService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', [
      'authUser',
      'signupUser',
    ]);
    cookieServiceMock = jasmine.createSpyObj('CookieService', ['set']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmitLoginForm', () => {
    it('should authenticate user and navigate to dashboard on success', () => {
      const loginResponse = {
        token: '12345',
        name: 'John Doe',
        id: '1',
        email: 'john.doe@test.com',
      };
      userServiceMock.authUser.and.returnValue(of(loginResponse));

      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password',
      });
      component.onSubmitLoginForm();

      expect(cookieServiceMock.set).toHaveBeenCalledWith('USER_INFO', '12345');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Bem-vindo John Doe',
        life: 2000,
      });
    });

    it('should show error message when authentication fails', () => {
      const errorResponse = { message: 'Invalid credentials' };
      userServiceMock.authUser.and.returnValue(throwError(() => errorResponse));

      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password',
      });
      component.onSubmitLoginForm();

      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao fazer login',
        life: 2000,
      });
    });
  });

  describe('onSubmitSignupForm', () => {
    it('should sign up user and show success message', () => {
      const signupResponse = {
        id: '1',
        name: 'John',
        email: 'john@test.com',
        message: 'User created successfully',
      };
      userServiceMock.signupUser.and.returnValue(of(signupResponse));

      component.signupForm.setValue({
        name: 'John',
        email: 'john@test.com',
        password: 'password',
      });
      component.onSubmitSignupForm();

      expect(component.loginCard).toBeTrue();
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Usuario criado com sucesso',
        life: 2000,
      });
    });

    it('should show error message when sign up fails', () => {
      const errorResponse = { message: 'Email already exists' };
      userServiceMock.signupUser.and.returnValue(
        throwError(() => errorResponse)
      );

      component.signupForm.setValue({
        name: 'John',
        email: 'john@test.com',
        password: 'password',
      });
      component.onSubmitSignupForm();

      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar Usuario',
        life: 2000,
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should call destroy$.next() and destroy$.complete()', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
