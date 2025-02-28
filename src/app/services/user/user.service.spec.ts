import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let cookieServiceMock: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    cookieServiceMock = jasmine.createSpyObj('CookieService', ['get', 'set']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: CookieService, useValue: cookieServiceMock }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('signupUser', () => {
    it('should send a POST request to signup a user and return a response', () => {
      const signupRequest: SignupUserRequest = { name: 'testUser', email: 'test@gmail.com', password: 'password123' };
      const signupResponse: SignupUserResponse = { id: '2', name: 'Test', email: 'test@gmail.com' };

      service.signupUser(signupRequest).subscribe(response => {
        expect(response.email).toBe('test@gmail.com');
      });

      const req = httpMock.expectOne(`${service['API_URL']}/user`);
      expect(req.request.method).toBe('POST');
      req.flush(signupResponse);
    });

    it('should handle errors when signup fails', () => {
      const signupRequest: SignupUserRequest = { name: 'testUser', email: 'test@gmail.com', password: 'password123' };

      service.signupUser(signupRequest).subscribe(
        () => fail('Expected an error'),
        (error) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(`${service['API_URL']}/user`);
      expect(req.request.method).toBe('POST');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('authUser', () => {
    it('should send a POST request to authenticate a user and return a token', () => {
      const authRequest: AuthRequest = { email: 'test@gmail.com', password: 'password123' };
      const authResponse: AuthResponse = { id: '2', name: 'Test', email: 'test@gmail.com', token: 'mockedJwtToken' };

      service.authUser(authRequest).subscribe(response => {
        expect(response.token).toBe('mockedJwtToken');
      });

      const req = httpMock.expectOne(`${service['API_URL']}/auth`);
      expect(req.request.method).toBe('POST');
      req.flush(authResponse);
    });

    it('should handle errors when authentication fails', () => {
      const authRequest: AuthRequest = { email: 'test@gmail.com', password: 'password123' };

      service.authUser(authRequest).subscribe(
        () => fail('Expected an error'),
        (error) => {
          expect(error.status).toBe(401);
        }
      );

      const req = httpMock.expectOne(`${service['API_URL']}/auth`);
      expect(req.request.method).toBe('POST');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if USER_INFO cookie exists', () => {
      cookieServiceMock.get.and.returnValue('mockedJwtToken');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if USER_INFO cookie does not exist', () => {
      cookieServiceMock.get.and.returnValue('');
      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});
