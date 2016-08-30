import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { BaseComponent } from '../base-component.component';
import { Notify } from '../../common/notify';

@Component({
	selector: 'login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.css']
})
export class LoginComponent extends BaseComponent {
	private isFinished: boolean = true;
	private isError: boolean = false;

	constructor(private authService: AuthService, private router: Router) {
		super();
	}

	ngOnInit() {
		super.ngOnInit();
		this.authService.logout(false);
	}

	login(username: string, password: string) {
		this.isFinished = false;
		this.isError = false;
		this.authService.login(username, password).subscribe(
			redirectUrl => this.router.navigate([redirectUrl]),
			error => {
				console.error(this.constructor.name, error);
				this.isFinished = true;
				if(error.status == 403)
					this.isError = true;
				else
					Notify.notifyError('Сервер временно недоступен');
			}
		);
	}
}