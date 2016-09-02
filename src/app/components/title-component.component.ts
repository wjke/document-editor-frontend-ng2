import { Title } from '@angular/platform-browser';
import { BaseComponent } from './base-component.component';

export class TitleComponent extends BaseComponent {
    constructor(private titleService: Title, private initTitle = 'Default title') {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.setTitle(this.initTitle);
    }

    setTitle(title: string) {
        this.titleService.setTitle(title);
    }

    getTitle() {
        return this.titleService.getTitle();
    }

    getInitTitle() {
        return this.initTitle;
    }
}
