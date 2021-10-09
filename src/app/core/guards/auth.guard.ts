import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';

import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}
  // CanActivate: válida se a rota está ativa;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthState(state.url);
  }
  // CanActivateChild: válida se a rota filha está ativa;
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }
  // CanLoad: válida se um módulo está utilizando o lazily loading
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const url = segments.map((s) => `/${s}`).join('');
    return this.checkAuthState(url).pipe(take(1));
  }

  private checkAuthState(redirect: string): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      tap((is) => {
        if (!is) {
          this.router.navigate(['/login'], {
            queryParams: { redirect }, // login?redirect=/tasks/create
          });
        }
      })
    );
  }
}
