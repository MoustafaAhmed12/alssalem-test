import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  http = inject(HttpClient);
  apiCacheService = inject(ApiCacheService);
  constructor() {}

  SaveSystemUsers(userInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/SaveSystemUsers`,
      userInfo
    );
  }
  getAllSystemUsers(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetAllSystemUsers`
    );
  }

  getUserById(userId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetUserById`,
      userId
    );
  }

  deleteSystemUser(userId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/DeleteSystemUser`,
      userId
    );
  }

  getSystemRoles(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetSystemRoles`
    );
  }
  getStudentTutorials(date: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetStudentTutorials`,
      date
    );
  }

  getAllQuestionTypes(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetAllQuestionTypes`
    );
  }
  saveQuestionTypes(questionTypeName: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/SaveQuestionTypes`,
      questionTypeName
    );
  }
}
