import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { BaseComponent } from '../base-component.component';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { TemplateField } from '../../models/template-field.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
	selector: 'template-field-new',
	templateUrl: 'template-field-new.component.html'
})
export class TemplateFieldNewComponent extends BaseComponent {
	@Input() private template: Template;
	@Output() onFieldAdded = new EventEmitter<void>();
	private field: TemplateField;
	private form: FormGroup;
	private isFinished = true;
	private formError: string;

	constructor(private templateService: TemplateService, private formBuilder: FormBuilder) {
		super();
	}

	ngOnInit() {
		super.ngOnInit();
		this.form = this.formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(2)]],
			type: ['0']
		});
	}

	private formSubmit(values) {
		if(!this.form.valid || !this.isFinished)
			return;
		
		this.formError = '';
		this.isFinished = false;
		values.title = values.title.trim();
		let field = new TemplateField(values);
		this.templateService.createTemplateField(field, this.template.id).subscribe(
			template => {
				this.fieldAdded();
			}, 
			error => {
				console.error(this.constructor.name, error);
				this.isFinished = true;
				if(error.status == 400)
					this.formError = Utils.getError(error);
				else
					Notify.notifyError('Ошибка при добавлении поля');
			}
		);
	}

	private fieldAdded() {
		this.isFinished = true;
		this.formError = '';
		this.form.reset();
		(<FormControl>this.form.controls['type']).setValue('0');
		this.onFieldAdded.emit();
		Notify.notifySuccess('Поле успешно добавлено');
	}
}