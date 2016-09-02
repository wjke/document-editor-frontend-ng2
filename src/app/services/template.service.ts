import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'
import 'rxjs/add/observable/never'

import { Template } from '../models/template.model';
import { TemplateField } from '../models/template-field.model';
import { environment } from '../../environments/environment';
import { Notify } from '../common/notify';

@Injectable()
export class TemplateService {
    private api: string = environment.api_url;

    constructor(private router: Router, private http: AuthHttp) {
        console.log(this.constructor.name, 'API URL:', this.api);
    }

    listAllTemplates(): Observable<Template[]> {
        return this.http.get(this.api + 'templates').map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    getTemplate(templateId: number): Observable<Template> {
        return this.http.get(this.api + 'templates/' + templateId).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    getTemplateFields(templateId: number): Observable<TemplateField[]> {
        return this.http.get(this.api + 'templates/' + templateId + '/fields').map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    createTemplate(template: Template): Observable<Template> {
        return this.http.post(this.api + 'templates', JSON.stringify(template)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    updateTemplate(template: Template): Observable<Template> {
        return this.http.put(this.api + 'templates/' + template.id, JSON.stringify(template)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    deleteTemplate(templateId: number): Observable<any> {
        return this.http.delete(this.api + 'templates/' + templateId).map(response => response).catch(error => this.handleError(error, this.router));
    }

    createTemplateField(field: TemplateField, templateId: number): Observable<TemplateField> {
        return this.http.post(this.api + 'fields/' + templateId, JSON.stringify(field)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    updateTemplateField(field: TemplateField): Observable<TemplateField> {
        return this.http.put(this.api + 'fields/' + field.id, JSON.stringify(field)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    deleteTemplateField(fieldId: number): Observable<any> {
        return this.http.delete(this.api + 'fields/' + fieldId).map(response => response).catch(error => this.handleError(error, this.router));
    }

    upDownTemplateField(fieldId: number, up: boolean): Observable<any> {
        return this.http.get(this.api + 'fields/' + fieldId + (up ? '/up' : '/down')).map(response => response).catch(error => this.handleError(error, this.router));
    }

    private handleError(error: Response, router: Router) {
        console.error(this.constructor.name, 'handleError:', error);
        if(error.status === 401 || error.status === 403) {
            router.navigate(['/login']); // THIS.router = NULL? WHY???
            Notify.notifyRetryLogin();
            return <Observable<any>>Observable.never();
        }
        return Observable.throw(error);
    }
}
