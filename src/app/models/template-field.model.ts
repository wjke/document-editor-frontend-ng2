export class TemplateField {
	id: number;
	title: string;
	type: string;
	ordering: number;

	constructor(values: Object = {}) {
    	Object.assign(this, values);
  	}
}