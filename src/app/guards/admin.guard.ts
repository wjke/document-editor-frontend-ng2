import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard {
    constructor(router: Router, authService: AuthService) {
        super(router, authService);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(!super.canActivate(route, state))
            return false;

        if(this.authService.isAdmin)
            return true;

        this.router.navigate(['/documents']);
        return false;
    }
}
