import { TemplateField } from './template-field.model';

export class Template {
	id: number;
	title: string;
	fields?: TemplateField[];
	
	constructor(values: Object = {}) {
    	Object.assign(this, values);
  	}
}