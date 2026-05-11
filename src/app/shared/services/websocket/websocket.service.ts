import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, EMPTY } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | null = null;
  private connected = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = io(environment.API_URL, {
        reconnectionAttempts: 3,
        reconnectionDelay: 5000,
        timeout: 4000,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        this.connected = true;
      });

      this.socket.on('connect_error', () => {
        
        this.connected = false;
      });

      this.socket.on('reconnect_failed', () => {
        
        this.socket?.disconnect();
      });

    } catch {
      
    }
  }

  public onProductUpdate(): Observable<void> {
    if (!this.socket) return EMPTY;

    return new Observable((observer) => {
      this.socket!.on('product_updated', () => {
        observer.next();
      });
    });
  }
}
