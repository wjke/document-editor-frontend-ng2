import { Title } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { TitleComponent } from '../title-component.component';
import { DocumentFieldDataEditComponent } from './document-field-data-edit.component';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
	selector: 'document-edit',
	templateUrl: 'document-edit.component.html'
})
export class DocumentEditComponent extends TitleComponent {
	@ViewChild(DocumentFieldDataEditComponent) private dataFields: DocumentFieldDataEditComponent;
	private document: Document;
	private subscription: Subscription;
	private form: FormGroup;
	private formError: string;
	private isFinished = true;
	private isDeleteFinished = true;

	constructor(private documentService: DocumentService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService, titleService: Title) {
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
					this.initDocument(id);
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		super.ngOnDestroy();
	}

	private initDocument(documentId: number) {
		this.documentService.getDocument(documentId).subscribe(
			document => {
				this.setTitle(this.getInitTitle() + ': ' + document.title);
				this.document = document;
				this.initForm();
				this.dataFields.init(this.document);
			},
			error => {
				console.error(this.constructor.name, error);
				Notify.notifyError('Ошибка при получении документа\n' + Utils.getError(error));
				this.router.navigate(['documents']);
			}
		);
	}

	private initForm() {
		this.form = this.formBuilder.group({
			title: [this.document.title, [Validators.required, Validators.minLength(2)]]
		});
	}

	private deleteDocument(documentId: number) {
		if(!this.isDeleteFinished)
			return;

		this.isDeleteFinished = false;
		this.documentService.deleteDocument(documentId).subscribe(
			res => {
				Notify.notifySuccess('Документ успешно удалён');
				this.router.navigate(['documents']);
			},
			error => { 
				console.error(this.constructor.name, error);
				this.isDeleteFinished = true;
				Notify.notifyError('Ошибка при удалении документа\n' + Utils.getError(error));
			}
		);
	}

	private formSubmit(values) {
		if(!this.form.valid || !this.isFinished)
			return;

		this.formError = '';
		this.isFinished = false;
		let newDocument = new Document({id: this.document.id, title: values.title.trim()});
		this.documentService.updateDocument(newDocument).subscribe(
			document => {
				Notify.notifySuccess('Документ успешно обновлён');
				this.router.navigate(['/documents', document.id])
			}, 
			error => {
				console.error(this.constructor.name, error);
				this.isFinished = true;
				if(error.status == 400)
					this.formError = Utils.getError(error);
				else
					Notify.notifyError('Ошибка при обновлении документа');
			}
		);
	}
}