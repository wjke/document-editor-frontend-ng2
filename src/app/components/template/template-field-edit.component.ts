import { Component, Input, Output, EventEmitter } from '@angular/core';

import { BaseComponent } from '../base-component.component';
import { TemplateField } from '../../models/template-field.model';
import { TemplateService } from '../../services/template.service';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
    selector: '[template-field-edit]',
    templateUrl: 'template-field-edit.component.html'
})
export class TemplateFieldEditComponent extends BaseComponent {
    @Input() private field: TemplateField;
    @Input() private index: number;
    @Input() private maxIndex: number;
    @Input() private isEnabled: boolean;
    @Output() private onChangeStart = new EventEmitter<void>();
    @Output() private onChanged = new EventEmitter<boolean>();
    private isFinished = true; // Определяет завершены ли операции с сетью(TemplateService)
    private fieldError: string;
    private newTitle: string;
    private newType: string;
    private isEdit = false; // В режиме редактирования

    constructor(private templateService: TemplateService) {
        super();
    }

    private deleteField(fieldId: number) {
        if(!this.isFinished || !this.isEnabled)
            return;

        this.onChangeStart.emit();
        this.isFinished = false;
        this.templateService.deleteTemplateField(fieldId).subscribe(
            res => {
                // Notify.notifySuccess('Поле успешно удалено');
            },
            error => {
                console.error(this.constructor.name, error);
                this.isFinished = true;
                Notify.notifyError('Ошибка при удалении поля\n' + Utils.getError(error));
            },
            () => this.onChanged.emit(true)
        );
    }

    private upDownField(fieldId: number, up: boolean) {
        if(!this.isFinished || !this.isEnabled)
            return;

        this.onChangeStart.emit();
        this.isFinished = false;
        this.templateService.upDownTemplateField(fieldId, up).subscribe(
            res => {
                // Notify.notifySuccess('Порядок успешно изменён', 2500);
            },
            error => {
                console.error(this.constructor.name, error);
                this.isFinished = true;
                Notify.notifyError('Ошибка при изменении порядка\n' + Utils.getError(error));
            },
            () => this.onChanged.emit(true)
        );
    }

    // Входим в режим редактирования
    private startEdit() {
        this.isEdit = true;
        this.fieldError = '';
        this.newTitle = this.field.title;
        this.newType = this.field.type;
        this.onChangeStart.emit();
    }

    // Выходим из режима редактирования
    // save - нажали сохранить или отменить
    private endEdit(save: boolean) {
        if(!this.isFinished)
            return;

        if(!save) {
            this.isEdit = false;
            this.onChanged.emit(save);
        } else {
            if(!this.newTitle.trim()) {
                this.fieldError = 'Минимум 1 символ';
                return;
            }

            this.isFinished = false;

            let field = new TemplateField();
            field.id = this.field.id;
            field.title = this.newTitle.trim();
            if(this.newType === 'TEXT') field.type = '0';
            else if(this.newType === 'TEXTAREA') field.type = '1';
            else if(this.newType === 'CHECKBOX') field.type = '2';

            this.templateService.updateTemplateField(field).subscribe(
                template => {
                    this.onChanged.emit(true);
                    Notify.notifySuccess('Поле успешно обновлено');
                },
                error => {
                    console.error(this.constructor.name, error);
                    this.isFinished = true;
                    if(error.status === 400)
                        this.fieldError = Utils.getError(error);
                    else
                        Notify.notifyError('Ошибка при обновлении поля');
                }
            );
        }
    }
}
