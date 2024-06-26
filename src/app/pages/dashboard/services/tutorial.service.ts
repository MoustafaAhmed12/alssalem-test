import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { Observable, tap } from 'rxjs';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  http = inject(HttpClient);
  apiCacheService = inject(ApiCacheService);

  numOfTutorials = signal<number>(0);
  numOfTutorialsWork = signal<number>(0);
  constructor() {}

  createTutorial(tutorialInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Tutorial/CreateTutorial`,
      tutorialInfo
    );
  }

  getTutorials(): Observable<ResponseHeader> {
    return this.apiCacheService
      .get<ResponseHeader>(`${environment.BASE_URL}/api/Tutorial/GetTutorials`)
      .pipe(tap((res: ResponseHeader) => this.getInfo(res.result)));
  }

  getInfo(tutorials: any): void {
    const len = tutorials.length;
    this.numOfTutorials.set(len);
    const lenOfTutorialsWork = tutorials.filter(
      (t: any) => t.isEnabled == true
    ).length;

    this.numOfTutorialsWork.set(lenOfTutorialsWork);
  }

  getAllTeachers(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Tutorial/GetAllTeachers`
    );
  }

  getQuestionTypes(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Tutorial/GetQuestionTypes`
    );
  }
  getTutorialQuestionTypes(tutorialId: {
    tutorialId: number;
  }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Tutorial/GetTutorialQuestionTypes`,
      tutorialId
    );
  }

  getTutorialById(tutorialId: {
    tutorialId: number;
  }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Tutorial/GetTutorialById`,
      tutorialId
    );
  }
}
