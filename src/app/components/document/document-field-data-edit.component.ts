import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { BaseComponent } from '../base-component.component';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { Utils } from '../../common/utils';
import { Notify } from '../../common/notify';

@Component({
    selector: 'document-field-data-edit',
    templateUrl: 'document-field-data-edit.component.html'
})
export class DocumentFieldDataEditComponent extends BaseComponent {
    @Output() private onDataFieldsSaved = new EventEmitter<void>();
    private document: Document;
    private dataTimeout = 5500;
    private timeoutStep = 500;
    private form: FormGroup;
    private isFinished = true;
    private timeoutId: number;

    constructor(private documentService: DocumentService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnDestroy() {
        if(this.timeoutId) {
            console.log(this.constructor.name, 'clearTimeout()');
            clearTimeout(this.timeoutId);
        }
        super.ngOnDestroy();
    }

    init(document: Document) {
        this.document = document;
        this.initDataFields(document.id);
    }

    private initDataFields(documentId: number) {
        this.documentService.getDataFields(documentId).subscribe(
            dataFields => {
                this.document.dataFields = dataFields;
                this.initForm();
            },
            error => {
                console.error(this.constructor.name, error);
                if(!this.isDestroyed)
                    this.timeoutId = setTimeout(() => this.initDataFields(documentId), this.dataTimeout += this.timeoutStep);
                Notify.notifyError('Ошибка при получении данных\n' + Utils.getError(error));
            }
        );
    }

    private initForm() {
        let formFields = {};
        for(let dataField of this.document.dataFields)
            formFields[dataField.id] = [dataField.data];
        this.form = this.formBuilder.group(formFields);
    }

    private formSubmit(values) {
        if(!this.isFinished)
            return;

        let fields = [];
        for(let dataField of this.document.dataFields)
            fields.push({id: dataField.id, data: values[dataField.id] === false ? '' : values[dataField.id]});

        this.isFinished = false;
        this.documentService.updateDataFields(this.document, fields).subscribe(
            dataFields => {
                this.onDataFieldsSaved.emit();
                Notify.notifySuccess('Данные документа успешно обновлены');
            },
            error => {
                console.error(this.constructor.name, error);
                Notify.notifyError('Ошибка при обновлении данных\n' + Utils.getError(error));
            },
            () => this.isFinished = true
        );
    }
}
