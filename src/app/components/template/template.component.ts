import { Component } from '@angular/core';

import { BaseComponent } from '../base-component.component';

@Component({
	template: `
	<navigation></navigation> 
	<div class="container">
		<div class="row">
			<router-outlet></router-outlet>
		</div>
	</div>`
})
export class TemplateComponent extends BaseComponent {
	
}