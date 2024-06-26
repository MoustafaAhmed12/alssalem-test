import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PromoService {
  http = inject(HttpClient);
  constructor(private apiCacheService: ApiCacheService) {}

  // API for School

  generateRandomPromoCodes(promoCodeInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GenerateRandomPromoCodes`,
      promoCodeInfo
    );
  }

  getAllPromoCodes(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetAllPromoCodes`
    );
  }

  getPromoCodeById(promoCodeId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetPromoCodeById`,
      promoCodeId
    );
  }

  deletePromoCode(promoCodeId: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/DeletePromoCode`,
      promoCodeId
    );
  }

  getAllTutorials(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/GetAllTutorials`
    );
  }
}
