import { Component } from '@angular/core';

import { BaseComponent } from '../base-component.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.component.html'
})
export class NavigataionComponent extends BaseComponent  {
    constructor(private authService: AuthService) {
        super();
    }
}
