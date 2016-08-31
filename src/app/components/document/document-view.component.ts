import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { TitleComponent } from '../title-component.component';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
	selector: 'document-view',
	templateUrl: 'document-view.component.html'
})
export class DocumentViewComponent extends TitleComponent {
	private document: Document;
	private subscription: Subscription;
	private isDeleteFinished = true;
	private dataTimeout = 5500;
	private timeoutStep = 500;
	private timeoutId: number;

	constructor(private documentService: DocumentService, private router: Router, private route: ActivatedRoute, private authService: AuthService, titleService: Title) {
		super(titleService, 'Документ');
	}

	ngOnInit() {
		super.ngOnInit();
		this.subscription = this.route.params.subscribe(
			params => {
				let id = +params['id'];
				if(isNaN(id))
					this.router.navigate(['documents']);
				else
					this.initDocument(+params['id']);
			}
		);
	}

	ngOnDestroy() {
		if(this.timeoutId) {
			console.log(this.constructor.name, 'clearTimeout()');
			clearTimeout(this.timeoutId);
		}

		this.subscription.unsubscribe();
		super.ngOnDestroy();
	}

	private deleteDocument(documentId: number) {
		if(!this.isDeleteFinished)
			return;

		this.isDeleteFinished = false;
		this.documentService.deleteDocument(documentId).subscribe(
			res => {
				this.router.navigate(['documents']);
				Notify.notifySuccess('Документ успешно удалён');
			},
			error => {
				console.error(this.constructor.name, error);
				this.isDeleteFinished = true;
				Notify.notifyError('Ошибка при удалении документа\n' + Utils.getError(error));
			}
		);
	}

	private initDocument(documentId: number) {
		this.documentService.getDocument(documentId).subscribe(
			document => {
				this.setTitle(this.getInitTitle() + ': ' + document.title);
				this.document = document;
				this.initDataFields(documentId);
			},
			error => {
				console.error(this.constructor.name, error);
				this.router.navigate(['documents']);
				Notify.notifyError('Ошибка при получении документа\n' + Utils.getError(error));
			}
		);
	}

	private initDataFields(documentId: number) {
		this.documentService.getDataFields(documentId).subscribe(
			dataFields => {
				this.document.dataFields = dataFields;
			},
			error => {
				console.error(this.constructor.name, error);
				if(!this.isDestroyed)
					this.timeoutId = setTimeout(() => this.initDataFields(documentId), this.dataTimeout += this.timeoutStep);
				Notify.notifyError('Ошибка при получении данных\n' + Utils.getError(error));
			}
		);
	}
}