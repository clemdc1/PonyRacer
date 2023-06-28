import { Inject, Injectable, Type } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';
import { Client, Subscription } from 'webstomp-client';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  constructor(@Inject(WEBSOCKET) private WebSocket: Type<WebSocket>, @Inject(WEBSTOMP) private Webstomp: any) {}
  connect<T>(channel: string): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      // TODO create the WebSocket connection
      const connection: WebSocket = new this.WebSocket(`${environment.wsBaseUrl}/ws`);
      // TODO create the stomp client with Webstomp
      const stompClient: Client = this.Webstomp.over(connection);
      // TODO connect the stomp client
      let subscription: Subscription;
      stompClient.connect(
        { login: '', passcode: '' },
        () => {
          // TODO subscribe to the specific channel
          // TODO emit the message received, after extracting the JSON from the body
          subscription = stompClient.subscribe(channel, message => {
            const bodyAsJson = JSON.parse(message.body);
            observer.next(bodyAsJson);
          });
        },
        error => {
          observer.error(error);
        }
      );
      // TODO handle the unsubscription
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        connection.close();
      };
    });
  }
}
