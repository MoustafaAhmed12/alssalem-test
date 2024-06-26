import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  toastr = inject(ToastrService);

  // Varibles
  currentUser = signal<any>(null);
  isAuth = signal<boolean>(false);

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly IS_AUTH = 'IS_AUTH';
  private readonly CURRENT_USER = 'CURRENT_USER';

  constructor(private router: Router) {
    const savedIsAuth = localStorage.getItem(this.IS_AUTH);
    this.isAuth.set(savedIsAuth ? JSON.parse(savedIsAuth) : false);

    const savedCurrentUser = localStorage.getItem(this.CURRENT_USER);
    this.currentUser.set(
      savedCurrentUser ? JSON.parse(savedCurrentUser) : null
    );
  }

  /// All Funs.

  // Login Fun.
  loginUser(userBody: any): Observable<any> {
    return this.http
      .post<any>(`${environment.BASE_URL}/api/Authentication/Login`, userBody)
      .pipe(
        tap((res: any) => {
          if (res.statusCode === 200) {
            this.doLoggedUser(res.token, res.result);
          }
        })
      );
  }

  // fun to store token of the user in localStorage and user data
  private doLoggedUser(token: string, userData: any) {
    localStorage.setItem(this.JWT_TOKEN, token);
    this.setCurrentUser(userData);
  }

  // Is LoggedIn
  setIsAuth(isAuth: boolean): void {
    this.isAuth.set(isAuth);
    localStorage.setItem(this.IS_AUTH, JSON.stringify(isAuth));
  }

  // Current User
  setCurrentUser(userData: any): void {
    if (userData) {
      this.currentUser.set(userData);
      localStorage.setItem(this.CURRENT_USER, JSON.stringify(userData));
    }
  }

  // LogOut Fun.
  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.CURRENT_USER);
    this.setIsAuth(false);
    this.router.navigateByUrl('/login');
    this.toastr.success('تم تسجيل الخروج بنجاح');
  }

  // Register Fun.
  createUser(userBody: any): Observable<any> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Authentication/Register`,
      userBody
    );
  }
  // Register Fun.
  registerParent(userBody: any): Observable<any> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Parent/RegisterParent`,
      userBody
    );
  }
}
