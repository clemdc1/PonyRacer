import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { jwtInterceptor } from './jwt.interceptor';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';

describe('jwtInterceptor', () => {
  let userService: jasmine.SpyObj<UserService>;
  let http: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getCurrentUser']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userService }
      ]
    });
    http = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should do nothing if no jwt token', () => {
    userService.getCurrentUser.and.returnValue(null);

    httpClient.get('/api/foo').subscribe();

    const testRequest = http.expectOne('/api/foo');
    expect(testRequest.request.headers.get('Authorization')).toBe(null);
  });

  it('should send a jwt token', () => {
    userService.getCurrentUser.and.returnValue({ token: 'hello' } as UserModel);

    httpClient.get('/api/foo').subscribe();

    const testRequest = http.expectOne('/api/foo');
    expect(testRequest.request.headers.get('Authorization')).toBe('Bearer hello');
  });
});
