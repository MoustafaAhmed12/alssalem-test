import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { Observable } from 'rxjs';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TutorilsStudentsService {
  http = inject(HttpClient);
  apiCacheService = inject(ApiCacheService);

  getAllCategories(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Student/GetCategories`
    );
  }

  getCustomCategoryTutorials(id: { id: number }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Student/GetCustomCategoryTutorials`,
      id
    );
  }
  getStudentTutorialById(tutorialIdAndUserId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Student/GetStudentTutorialById`,
      tutorialIdAndUserId
    );
  }
  getStudentVideo(chapterIdAndUserId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Student/GetStudentVideo`,
      chapterIdAndUserId
    );
  }
  getStudentExam(examIdAndUserId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Student/GetStudentExam`,
      examIdAndUserId
    );
  }

  createTutorialComment(commentInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Tutorial/CreateTutorialComment`,
      commentInfo
    );
  }
}
