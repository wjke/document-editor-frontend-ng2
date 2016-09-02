import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { TitleComponent } from '../title-component.component';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
    selector: 'template-view',
    templateUrl: 'template-view.component.html'
})
export class TemplateViewComponent extends TitleComponent {
    private template: Template;
    private subscription: Subscription;
    private isDeleteFinished = true;
    private fieldsTimeout = 5500;
    private timeoutStep = 500;
    private timeoutId: number;

    constructor(private templateService: TemplateService, private router: Router, private route: ActivatedRoute, titleService: Title) {
        super(titleService, 'Шаблон');
    }

    ngOnInit() {
        super.ngOnInit();
        this.subscription = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                if(isNaN(id))
                    this.router.navigate(['templates']);
                else
                    this.initTemplate(+params['id']);
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

    private deleteTemplate(templateId: number) {
        if(!this.isDeleteFinished)
            return;

        this.isDeleteFinished = false;
        this.templateService.deleteTemplate(templateId).subscribe(
            res => {
                this.router.navigate(['templates']);
                Notify.notifySuccess('Шаблон успешно удалён');
            },
            error => {
                console.error(this.constructor.name, error);
                this.isDeleteFinished = true;
                Notify.notifyError('Ошибка при удалении шаблона\n' + Utils.getError(error));
            }
        );
    }

    private initTemplate(templateId: number) {
        this.templateService.getTemplate(templateId).subscribe(
            template => {
                this.setTitle(this.getInitTitle() + ': ' + template.title);
                this.template = template;
                this.initFields(templateId);
            },
            error => {
                console.error(this.constructor.name, error);
                this.router.navigate(['templates']);
                Notify.notifyError('Ошибка при получении шаблона\n' + Utils.getError(error));
            }
        );
    }

    private initFields(templateId: number) {
        this.templateService.getTemplateFields(templateId).subscribe(
            fields => this.template.fields = fields,
            error => {
                console.error(this.constructor.name, error);
                if(!this.isDestroyed)
                    this.timeoutId = setTimeout(() => this.initFields(templateId), this.fieldsTimeout += this.timeoutStep);
                Notify.notifyError('Ошибка при получении списка полей\n' + Utils.getError(error));
            }
        );
    }
}
