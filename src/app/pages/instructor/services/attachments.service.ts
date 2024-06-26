import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  http = inject(HttpClient);
  constructor() {}

  // Attachments
  UploadPdf(formData: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/AttachmentStore/UploadPdf`,
      formData
    );
  }

  getAllAttachments(userId: { userId: number }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/AttachmentStore/GetAllAttachmentsResponse`,
      userId
    );
  }
  deletePdf(pdfId: { pdfId: number }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/AttachmentStore/DeleteVideo`,
      pdfId
    );
  }

  getTutorialAttachments(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Teacher/GetTutorialAttachments`
    );
  }
  getChaptersAttachments(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Teacher/GetChaptersAttachments`
    );
  }
}
