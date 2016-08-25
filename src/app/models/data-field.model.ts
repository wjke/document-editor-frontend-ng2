import { TemplateField } from './template-field.model';

export class DataField {
	id: number;
	data: string;
	templateField?: TemplateField;

	constructor(values: Object = {}) {
    	Object.assign(this, values);
  	}
}