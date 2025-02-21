import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { environment } from 'src/app/environments/environment';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;
  let cookieServiceMock: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    cookieServiceMock = jasmine.createSpyObj('CookieService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    });

    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should signup a user successfully', () => {
    const signupRequest: SignupUserRequest = {
      name: 'testUser',
      email: 'testUser@gmail.com',
      password: 'password123',
    };
    const signupResponse: SignupUserResponse = {
      id: '1',
      name: 'test',
      email: 'user@gmail.com',
    };

    userService.signupUser(signupRequest).subscribe((response) => {
      expect(response).toEqual(signupResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/user`);
    expect(req.request.method).toBe('POST');
    req.flush(signupResponse);
  });

  it('should authenticate a user successfully', () => {
    const authRequest: AuthRequest = {
      email: 'testUser@gmail.com',
      password: 'password123',
    };
    const authResponse: AuthResponse = {
      token: 'fake-jwt-token',
      id: '1',
      name: 'Test User',
      email: 'testUser@gmail.com',
    };

    userService.authUser(authRequest).subscribe((response) => {
      expect(response).toEqual(authResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/auth`);
    expect(req.request.method).toBe('POST');
    req.flush(authResponse);
  });

  it('should return true if the user is logged in', () => {
    cookieServiceMock.get.and.returnValue('fake-jwt-token');

    const result = userService.isLoggedIn();

    expect(result).toBeTrue();
  });

  it('should return false if the user is not logged in', () => {
    cookieServiceMock.get.and.returnValue('');

    const result = userService.isLoggedIn();

    expect(result).toBeFalse();
  });
});
