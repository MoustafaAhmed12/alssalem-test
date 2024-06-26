import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  http = inject(HttpClient);
  constructor(private apiCacheService: ApiCacheService) {}

  // API for School

  SaveSchool(schoolInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/SaveSchool`,
      schoolInfo
    );
  }

  getSystemSchools(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/getallschools`
    );
  }

  getSchoolById(schoolId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetSchoolById`,
      schoolId
    );
  }

  deleteSchool(schoolId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/DeleteSchool`,
      schoolId
    );
  }
}
