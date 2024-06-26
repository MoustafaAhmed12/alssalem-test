import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { GlobalConstants } from '../../../shared/utils/global-constants';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  http = inject(HttpClient);
  constructor() {}

  getPayments(date: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Payment/GetPayments`,
      date
    );
  }
}
