import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provide } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Http } from '@angular/http'
import 'rxjs/add/operator/delay';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { environment } from './environments/environment';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { NavigataionComponent } from './components/shared/navigation.component';
import { DocumentComponent } from './components/document/document.component';
import { DocumentNewComponent } from './components/document/document-new.component';
import { DocumentViewComponent } from './components/document/document-view.component';
import { DocumentEditComponent } from './components/document/document-edit.component';
import { DocumentListComponent } from './components/document/document-list.component';
import { DocumentFieldDataEditComponent } from './components/document/document-field-data-edit.component';
import { TemplateComponent } from './components/template/template.component';
import { TemplateViewComponent } from './components/template/template-view.component';
import { TemplateEditComponent } from './components/template/template-edit.component';
import { TemplateNewComponent } from './components/template/template-new.component';
import { TemplateFieldNewComponent } from './components/template/template-field-new.component';
import { TemplateListComponent } from './components/template/template-list.component';
import { TemplateFieldEditComponent } from './components/template/template-field-edit.component';
import { LoginComponent } from './components/auth/login.component';
import { AuthService } from './services/auth.service';
import { TemplateService } from './services/template.service';
import { DocumentService } from './services/document.service';

import { TrimDirective } from './pipes/trim.directive';

@NgModule({
	declarations: [
		AppComponent,
		//NgModule AppModule uses xxxComponent via "entryComponents" but it was neither declared nor imported! This warning will become an error after final.
		NavigataionComponent,
		DocumentComponent,
		DocumentNewComponent,
		DocumentViewComponent,
		DocumentEditComponent,
		DocumentListComponent,
		DocumentFieldDataEditComponent,
		TemplateComponent,
		TemplateViewComponent,
		TemplateEditComponent,
		TemplateNewComponent,
		TemplateFieldNewComponent,
		TemplateListComponent,
		TemplateFieldEditComponent,
		LoginComponent,
		TrimDirective
	],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		HttpModule,
		JsonpModule,
		ReactiveFormsModule,
		routing
	],
	providers: [
		AuthGuard,
		AdminGuard,
		AuthService,
		TemplateService,
		DocumentService,
		provide(AuthHttp, {
			useFactory: (http) => {
				return new AuthHttp(new AuthConfig({
					headerName: environment.jwt,
					tokenName: environment.jwt,
					noTokenScheme: true
				}), http);
			},
			deps: [Http]
		})
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {

}
