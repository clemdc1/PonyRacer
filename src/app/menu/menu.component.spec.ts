import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';

import { MenuComponent } from './menu.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('MenuComponent', () => {
  const userService = {
    userEvents: new Subject<UserModel>(),
    logout: () => {},
    scoreUpdates: (userId: number) => {}
  } as UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: UserService, useValue: userService }]
    });
    // turn off the animation for the collapse
    const collapseConfig = TestBed.inject(NgbCollapseConfig);
    collapseConfig.animation = false;
  });

  it('should have a `navbarCollapsed` field', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    expect(fixture.componentInstance.navbarCollapsed)
      .withContext(
        'Check that `navbarCollapsed` is initialized with `true`. Maybe you forgot to declare `navbarCollapsed` in your component.'
      )
      .toBe(true);
  });

  it('should have a `toggleNavbar` method', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    expect(fixture.componentInstance.toggleNavbar).withContext('Maybe you forgot to declare a `toggleNavbar()` method').not.toBeNull();

    fixture.componentInstance.toggleNavbar();

    expect(fixture.componentInstance.navbarCollapsed)
      .withContext('`toggleNavbar()` should change `navbarCollapsed` from `true` to `false`')
      .toBe(false);

    fixture.componentInstance.toggleNavbar();

    expect(fixture.componentInstance.navbarCollapsed)
      .withContext('`toggleNavbar()` should change `navbarCollapsed` from false to true`')
      .toBe(true);
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar');
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should use the `ngbCollapse` directive')
      .not.toContain('show');

    const button = element.querySelector('button');
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar');
    expect(navbar.classList).withContext('The element with the id `#navbar` should use the `ngbCollapse` directive').toContain('show');
  });

  it('should use routerLink to navigate', () => {
    const scoreUpdates = new Subject<UserModel>();
    spyOn(userService, 'scoreUpdates').and.returnValue(scoreUpdates);

    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).withContext('You should have only one routerLink to the home when the user is not logged').toBe(1);
    userService.userEvents.next({ login: 'cedric', money: 200 } as UserModel);
    fixture.detectChanges();

    const linksAfterLogin = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(linksAfterLogin.length)
      .withContext('You should have three routerLink: one to the races, one to the home, one to the money history when the user is logged')
      .toBe(3);
  });

  it('should listen to userEvents and score updates', fakeAsync(() => {
    const fixture = TestBed.createComponent(MenuComponent);

    // emulate a login
    const scoreUpdates = new Subject<UserModel>();
    spyOn(userService, 'scoreUpdates').and.returnValue(scoreUpdates);
    const user = { id: 1, login: 'cedric', money: 200 } as UserModel;
    let userEvent: UserModel | null = null;
    fixture.componentInstance.userEvents.subscribe(event => (userEvent = event));
    userService.userEvents.next(user);
    tick();
    expect(userEvent!).withContext('Your component should listen to the `userEvents` observable on login').toBe(user);

    expect(userService.scoreUpdates).toHaveBeenCalledWith(user.id);
    tick();

    // emulate a score update
    user.money = 300;
    scoreUpdates.next(user);
    tick();

    expect(userEvent!.money).withContext('Your component should listen to the `scoreUpdates` observable').toBe(300);

    // emulate an error
    scoreUpdates.error('You should catch potential errors on score updates with a `.catch()`');
    tick();
    expect(userEvent!.money).withContext('Your component should catch error on score updates').toBe(300);

    // emulate a score update
    user.money = 400;
    scoreUpdates.next(user);
    tick();

    expect(userEvent!.money).withContext('Your component should catch error on score updates').toBe(400);

    // emulate a logout
    userService.userEvents.next(null);
    tick();

    expect(userEvent).withContext('Your component should listen to the `userEvents` observable on logout').toBe(null);
  }));

  it('should display the user if logged', () => {
    const scoreUpdates = new Subject<UserModel>();
    spyOn(userService, 'scoreUpdates').and.returnValue(scoreUpdates);

    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    userService.userEvents.next({ login: 'cedric', money: 200 } as UserModel);

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('a.nav-link > #current-user');
    expect(info).withContext('You should have an `a` element with the classes `nav-link` to display the user info').not.toBeNull();
    expect(info.textContent).withContext('You should display the name of the user in an `a` element').toContain('cedric');
    expect(info.textContent).withContext('You should display the score of the user in an `a` element').toContain('200');
  });

  it('should display a logout button', () => {
    const scoreUpdates = new Subject<UserModel>();
    spyOn(userService, 'scoreUpdates').and.returnValue(scoreUpdates);

    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    userService.userEvents.next({ login: 'cedric', money: 200 } as UserModel);
    fixture.detectChanges();
    spyOn(fixture.componentInstance, 'logout');

    const element = fixture.nativeElement;
    const logout = element.querySelector('span.fa-power-off');
    expect(logout).withContext('You should have a span element with a class `fa-power-off` to log out').not.toBeNull();
    logout.dispatchEvent(new Event('click', { bubbles: true }));

    fixture.detectChanges();
    expect(fixture.componentInstance.logout).toHaveBeenCalled();
  });

  it('should stop the click event propagation', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const fixture = TestBed.createComponent(MenuComponent);
    const event = new Event('click');
    spyOn(userService, 'logout');
    spyOn(event, 'preventDefault');
    fixture.componentInstance.logout(event);

    expect(userService.logout).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
