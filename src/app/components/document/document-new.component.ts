import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BaseComponent } from '../base-component.component';
import { DocumentService } from '../../services/document.service';
import { TemplateService } from '../../services/template.service';
import { Document } from '../../models/document.model';
import { Template } from '../../models/template.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
	selector: 'document-new',
	templateUrl: 'document-new.component.html'
})
export class DocumentNewComponent extends BaseComponent {
	private templates: Template[];
	private listTimeout = 5500;
	private timeoutStep = 500;
	private form: FormGroup;
	private formError: string;
	private isFinished = true;
	private timeoutId: number;

	constructor(private documentService: DocumentService, private templateService: TemplateService, private formBuilder: FormBuilder, private router: Router) {
		super()
	}

	ngOnInit() {
		super.ngOnInit();
		this.initTemplates();
	}

	ngOnDestroy() {
		if(this.timeoutId) {
			console.log(this.constructor.name, 'clearTimeout()');
			clearTimeout(this.timeoutId);
		}
		super.ngOnDestroy();
	}

	private formSubmit(values) {
		if(!this.form.valid || !this.isFinished)
			return;
		
		this.formError = '';
		this.isFinished = false;
		values.title = values.title.trim();
		let document = new Document(values);
		this.documentService.createDocument(document, values.templateId).subscribe(
			document => {
				this.router.navigate(['/documents', document.id]);
				Notify.notifySuccess('Документ успешно добавлен');
			}, 
			error => {
				console.error(this.constructor.name, error);
				this.isFinished = true;
				if(error.status == 400)
					this.formError = Utils.getError(error);
				else
					Notify.notifyError('Ошибка при добавлении документа');
			}
		);
	}

	private initTemplates() {
		this.templateService.listAllTemplates().subscribe(
			templates => {
				this.templates = templates;
				if(this.templates.length > 0)
					this.initForm();
			},
			error => {
				console.error(this.constructor.name, error);
				if(!this.isDestroyed)
					this.timeoutId = setTimeout(() => this.initTemplates(), this.listTimeout += this.timeoutStep);
				Notify.notifyError('Ошибка при получении списка шаблонов');
			}
		);
	}

	private initForm() {
		this.form = this.formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(2)]],
			templateId: [this.templates[0].id]
		});
	}
}