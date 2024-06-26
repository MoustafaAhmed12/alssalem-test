import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ResponseHeader } from '../../../shared/shared-model/model';
import { Observable, tap } from 'rxjs';
import { ApiCacheService } from '../../../shared/services/api-cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PackageTutorialService {
  http = inject(HttpClient);
  apiCacheService = inject(ApiCacheService);

  constructor() {}

  savePackage(packageInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/PackageTutorials/SavePackage`,
      packageInfo
    );
  }

  getPackages(): Observable<ResponseHeader> {
    return this.apiCacheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/PackageTutorials/GetPackages`
    );
  }

  getPackageById(packageId: { packageId: number }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/PackageTutorials/GetPackageById`,
      packageId
    );
  }
  getAllSystemTutorials(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/PackageTutorials/GetAllSystemTutorials`
    );
  }

  activateAndDeActivatePackage(packageId: {
    packageId: number;
  }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/PackageTutorials/ActivateAndDeActivatePackage`,
      packageId
    );
  }
}
