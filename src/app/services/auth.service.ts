import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    private api: string = environment.api_url;
    private token: string;
    username: string;
    isAdmin: boolean = false;
    redirectUrl: string;
    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http: Http, private router: Router) {
        console.log(this.constructor.name, 'API URL:', this.api);
        this.token = localStorage.getItem(environment.jwt);
        if(this.token)
            this.parseToken();
    }

    private parseToken() {
        if(this.isExpired())
            this.logout(false);
        else {
            let parsedToken = this.jwtHelper.decodeToken(this.token);
            this.username = parsedToken.sub;
            this.isAdmin = parsedToken.admin;
        }
    }

    login(username: string, password: string): Observable<string> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.api + 'token', JSON.stringify({username: username, password: password}), {headers}).map(response => {
            let token = response.json() && response.json().token;
            if(token) {
                this.token = token;
                this.parseToken();
                localStorage.setItem(environment.jwt, token);
                let redirectUrlResult = this.redirectUrl ? this.redirectUrl : '';
                this.redirectUrl = '';
                return redirectUrlResult;
            } else
                throw new Error('token not found');
        });
    }

    logout(goToLoginPage: boolean) {
        this.token = '';
        localStorage.removeItem(environment.jwt);
        if(goToLoginPage)
            this.router.navigate(['/login']);
    }

    isAuth(): boolean {
        return !this.isExpired();
    }

    isExpired(): boolean {
        return !this.token || this.token && this.jwtHelper.isTokenExpired(this.token);
    }
}
