import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const rolesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const toastr = inject(ToastrService);
  const { roleDto } = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}');
  const { routeConfig } = route;

  /// اللي رايحله
  const { path } = routeConfig as Route;
  if (path === 'admin' && roleDto.roleName === 'أدمن') {
    return true;
  }
  if (path === 'supervisor' && roleDto.roleName === 'مشرف مدرسة') {
    return true;
  }
  if (path === 'parent' && roleDto.roleName === 'ولي أمر') {
    return true;
  }
  if (
    path === 'instructor' &&
    (roleDto.roleName === 'مدرس' || roleDto.roleName === 'مدخل بيانات')
  ) {
    return true;
  }
  router.navigateByUrl(
    roleDto.roleName === 'أدمن'
      ? '/admin'
      : roleDto.roleName === 'ولي أمر'
      ? '/parent'
      : roleDto.roleName === 'مشرف مدرسة'
      ? '/supervisor'
      : roleDto.roleName === 'مدرس'
      ? '/instructor'
      : roleDto.roleName === 'مدخل بيانات'
      ? '/instructor'
      : '/'
  );
  toastr.error('ليس لديك صلاحية للدخول');

  return false;
};
