import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { loggedInGuard } from './logged-in.guard';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';

describe('loggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => loggedInGuard(...guardParameters));
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getCurrentUser']);
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: userService }]
    });
  });

  it('should allow activation if user is logged in', () => {
    userService.getCurrentUser.and.returnValue({} as UserModel);

    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBe(true);
  });

  it('should forbid activation if user is not logged in, and navigate to home', () => {
    userService.getCurrentUser.and.returnValue(null);
    const router = TestBed.inject(Router);
    const urlTree: UrlTree = router.parseUrl('/');

    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toEqual(urlTree);
  });
});
