import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'
import 'rxjs/add/observable/never'

import { Document } from '../models/document.model';
import { DataField } from '../models/data-field.model';
import { environment } from '../../environments/environment';
import { Notify } from '../common/notify';

@Injectable()
export class DocumentService {
    private api: string = environment.api_url;

    constructor(private router: Router, private http: AuthHttp) {
        console.log(this.constructor.name, 'API URL:', this.api);
    }

    listAllDocuments(): Observable<Document[]> {
        return this.http.get(this.api + 'documents').map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    getDocument(documentId: number): Observable<Document> {
        return this.http.get(this.api + 'documents/' + documentId).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    getDataFields(documentId: number): Observable<DataField[]> {
        return this.http.get(this.api + 'documents/' + documentId + '/datafields').map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    updateDataFields(document: Document, fields): Observable<Document> {
        return this.http.post(this.api + 'datafields/' + document.id, JSON.stringify(fields)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    createDocument(document: Document, templateId: number): Observable<Document> {
        return this.http.post(this.api + 'documents/' + templateId, JSON.stringify(document)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    updateDocument(document: Document): Observable<Document> {
        return this.http.put(this.api + 'documents/' + document.id, JSON.stringify(document)).map(response => response.json()).catch(error => this.handleError(error, this.router));
    }

    deleteDocument(documentId: number): Observable<any> {
        return this.http.delete(this.api + 'documents/' + documentId).map(response => response).catch(error => this.handleError(error, this.router));
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
