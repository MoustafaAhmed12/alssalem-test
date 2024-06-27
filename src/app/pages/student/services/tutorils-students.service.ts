import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TutorilsStudentsService {
  http = inject(HttpClient);

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
