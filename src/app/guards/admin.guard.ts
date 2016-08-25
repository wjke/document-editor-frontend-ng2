import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard {
	constructor(public router: Router, public authService: AuthService) {
		super(router, authService);
	}

	canActivate() {
		if(super.canActivate() && this.authService.isAdmin)
			return true;

		this.router.navigate(['/documents']);
        return false;
    }
}