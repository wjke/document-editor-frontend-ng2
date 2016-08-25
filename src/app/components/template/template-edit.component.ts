import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from '../base-component.component';
import { TemplateService } from '../../services/template.service';
import { TemplateListComponent } from './template-list.component';
import { TemplateFieldNewComponent } from './template-field-new.component';
import { TemplateFieldEditComponent } from './template-field-edit.component';
import { Template } from '../../models/template.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
	selector: 'selector',
	directives: [TemplateListComponent, TemplateFieldNewComponent, TemplateFieldEditComponent],
	templateUrl: 'template-edit.component.html'
})
export class TemplateEditComponent extends BaseComponent {
	private template: Template;
	private subscription: Subscription; //Подписка на получение параметров из url
	private form: FormGroup;
	private isFinished = true; //Завершен ли запрос на сохранение шаблона
	private isDeleteFinished = true; //Завершен ли запрос на удаление шаблона
	private isFieldFinished = true; //Завершен ли запрос от дочерних элементов(TemplateFieldEditComponent) на изменение поля
	private fieldsTimeout = 5500; //При неудачном получении списка полей, через какое время повторно запросить
	private timeoutStep = 500; //На сколько с каждым разом увеличивать время повторного получения списка полей
	private formError: string;
	private timeoutId: number;

	constructor(private templateService: TemplateService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
		super();
	}

	ngOnInit() {
		super.ngOnInit();
		this.subscription = this.route.params.subscribe(
			params => {
				let id = +params['id'];
				if(isNaN(id))
					this.router.navigate(['templates']);
				else
					this.initTemplate(id);
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

	private formSubmit(values) {
		if(!this.form.valid || !this.isFinished)
			return;

		this.formError = '';
		this.isFinished = false;
		this.template.title = values.title.trim();
		this.templateService.updateTemplate(this.template).subscribe(
			template => {
				Notify.notifySuccess('Шаблон успешно обновлён');
				this.router.navigate(['/templates', template.id])
			}, 
			error => {
				console.error(this.constructor.name, error);
				this.isFinished = true;
				if(error.status == 400)
					this.formError = Utils.getError(error);
				else
					Notify.notifyError('Ошибка при обновлении шаблона');
			}
		);
	}

	private deleteTemplate(templateId: number) {
		if(!this.isDeleteFinished)
			return;

		this.isDeleteFinished = false;
		this.templateService.deleteTemplate(templateId).subscribe(
			res => {
				Notify.notifySuccess('Шаблон успешно удалён');
				this.router.navigate(['templates']);
			},
			error => { 
				console.error(this.constructor.name, error);
				this.isDeleteFinished = true;
				Notify.notifyError('Ошибка при удалении шаблона\n' + Utils.getError(error));
			}
		);
	}

	private initForm() {
		this.form = this.formBuilder.group({
			title: [this.template.title, [Validators.required, Validators.minLength(2)]]
		});
	}

	private initTemplate(templateId: number) {
		this.templateService.getTemplate(templateId).subscribe(
			template => {
				this.template = template;
				this.initForm();
				this.initFields();
			},
			error => {
				console.error(this.constructor.name, error);
				Notify.notifyError('Ошибка при получении шаблона\n' + Utils.getError(error));
				this.router.navigate(['templates']);
			}
		);
	}

	private initFields() {
		this.templateService.getTemplateFields(this.template.id).subscribe(
			fields => {
				this.template.fields = fields;
				this.isFieldFinished = true;
			}, 
			error => {
				console.error(this.constructor.name, error);
				if(!this.isDestroyed)
					this.timeoutId = setTimeout(() => this.initFields(), this.fieldsTimeout += this.timeoutStep);
				Notify.notifyError('Ошибка при получении списка полей\n' + Utils.getError(error));
			}
		);
	}

	private fieldChanged(save: boolean) {
		if(save)
			this.initFields();
		else
			this.isFieldFinished = true;
	}

	//При изменении поля(удаление, порядк, имя) блокируем изменение
	private fieldChangeStart() {
		this.isFieldFinished = false;
	}
}