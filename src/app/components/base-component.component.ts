import { OnInit, OnDestroy } from '@angular/core';

export class BaseComponent implements OnInit, OnDestroy {
	isDestroyed = false;

	constructor() {
		console.log(this.constructor.name, 'constructor()');
	}
	
	ngOnInit() {
		console.log(this.constructor.name, 'init()');
	}

	ngOnDestroy() {
		this.isDestroyed = true;
		console.log(this.constructor.name, 'destroy()');
	}
}