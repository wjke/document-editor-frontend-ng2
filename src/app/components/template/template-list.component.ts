import { Component } from '@angular/core';

import { BaseComponent } from '../base-component.component';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { Notify } from '../../common/notify';

@Component({
	selector: 'template-list',
	templateUrl: 'template-list.component.html'
})
export class TemplateListComponent extends BaseComponent {
	private templates: Template[];
	private listTimeout = 5500;
	private timeoutStep = 500;
	private timeoutId: number;

	constructor(private templateService: TemplateService) {
		super();
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

	private initTemplates() {
		this.templateService.listAllTemplates().subscribe(
			templates => this.templates = templates,
			error => {
				console.error(this.constructor.name, error);
				if(!this.isDestroyed)
					this.timeoutId = setTimeout(() => this.initTemplates(), this.listTimeout += this.timeoutStep);
				Notify.notifyError('Ошибка при получении списка шаблонов');
			}
		);
	}
}