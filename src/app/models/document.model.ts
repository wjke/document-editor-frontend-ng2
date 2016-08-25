import { Template } from './template.model';
import { DataField } from './data-field.model';

export class Document {
	id: number;
	title: string;
	template?: Template;
	dataFields?: DataField[];

	constructor(values: Object = {}) {
    	Object.assign(this, values);
  	}
}