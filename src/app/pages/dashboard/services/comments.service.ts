import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  http = inject(HttpClient);
  apiCacheService = inject(ApiCacheService);
  constructor() {}

  getAllComments(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetAllComments`
    );
  }
  updateCommentApproval(commentInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/UpdateCommentApproval`,
      commentInfo
    );
  }
}
