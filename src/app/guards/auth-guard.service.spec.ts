import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from './../services/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardService', () => {
  let authGuard: AuthGuardService;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    userServiceMock = jasmine.createSpyObj('UserService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuardService,
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuardService);
  });

  it('should allow access if the user is logged in', () => {
    userServiceMock.isLoggedIn.and.returnValue(true);

    const result = authGuard.canActivate();

    expect(result).toBeTrue();
  });

  it('should redirect to the home page if the user is not logged in', () => {
    userServiceMock.isLoggedIn.and.returnValue(false);

    const result = authGuard.canActivate();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    expect(result).toBeFalse();
  });
});
