import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { environment } from 'src/environments/environment';
import { WsService } from './ws.service';
import { MoneyHistoryModel } from './models/money-history.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents = new BehaviorSubject<UserModel | null>(null);
  constructor(private http: HttpClient, private wsService: WsService) {
    this.retrieveUser();
  }
  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const params = { login, password, birthYear };
    return this.http.post<UserModel>(environment.baseUrl + `/api/users`, params);
  }
  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    return this.http
      .post<UserModel>(environment.baseUrl + `/api/users/authentication`, credentials)
      .pipe(tap((user: UserModel) => this.storeLoggedInUser(user)));
  }
  storeLoggedInUser(user: UserModel): void {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }
  retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.userEvents.next(user);
    }
  }
  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }
  getCurrentUser(): UserModel | null {
    return this.userEvents.getValue();
  }
  scoreUpdates(userId: number): Observable<UserModel> {
    return this.wsService.connect<UserModel>(`/player/${userId}`);
  }
  getMoneyHistory(): Observable<Array<MoneyHistoryModel>> {
    return this.http.get<Array<MoneyHistoryModel>>(environment.baseUrl + `/api/money/history`);
  }
}
