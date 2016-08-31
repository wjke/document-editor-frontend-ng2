import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TitleComponent } from '../title-component.component';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
	selector: 'template-new',
	templateUrl: 'template-new.component.html'
})
export class TemplateNewComponent extends TitleComponent {
	private form: FormGroup;
	private formError: string;
	private isFinished = true;

	constructor(private templateService: TemplateService, private formBuilder: FormBuilder, private router: Router, titleService: Title) {
		super(titleService, 'Шаблоны');
	}

	ngOnInit() {
		super.ngOnInit();
		this.form = this.formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(2)]]
		});
	}

	private formSubmit(values) {
		if(!this.form.valid || !this.isFinished)
			return;
		
		this.formError = '';
		this.isFinished = false;
		values.title = values.title.trim();
		let template = new Template(values);
		this.templateService.createTemplate(template).subscribe(
			template => {
				this.router.navigate(['/templates', template.id]);
				Notify.notifySuccess('Шаблон успешно добавлен');
			}, 
			error => {
				console.error(this.constructor.name, error);
				this.isFinished = true;
				if(error.status == 400)
					this.formError = Utils.getError(error);
				else
					Notify.notifyError('Ошибка при добавлении шаблона');
			}
		);
	}
}