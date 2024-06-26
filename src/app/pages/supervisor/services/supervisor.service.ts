import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  http = inject(HttpClient);
  constructor() {}

  getSchoolStudents(userId: { userId: number }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperVisor/GetSchoolStudents`,
      userId
    );
  }
}
