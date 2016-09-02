import { Component } from '@angular/core';

import { BaseComponent } from '../base-component.component';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { Notify } from '../../common/notify';

@Component({
    selector: 'document-list',
    templateUrl: 'document-list.component.html'
})
export class DocumentListComponent extends BaseComponent {
    private documents: Document[];
    private listTimeout = 5500;
    private timeoutStep = 500;
    private timeoutId: number;

    constructor(private documentService: DocumentService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initDocuments();
    }

    ngOnDestroy() {
        if(this.timeoutId) {
            console.log(this.constructor.name, 'clearTimeout()');
            clearTimeout(this.timeoutId);
        }
        super.ngOnDestroy();
    }

    private initDocuments() {
        this.documentService.listAllDocuments().subscribe(
            documents => this.documents = documents,
            error => {
                console.error(this.constructor.name, error);
                if(!this.isDestroyed)
                    this.timeoutId = setTimeout(() => this.initDocuments(), this.listTimeout += this.timeoutStep);
                Notify.notifyError('Ошибка при получении списка документов');
            }
        );
    }
}
