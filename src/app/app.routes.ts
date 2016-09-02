import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DocumentComponent } from './components/document/document.component';
import { DocumentNewComponent } from './components/document/document-new.component';
import { DocumentViewComponent } from './components/document/document-view.component';
import { DocumentEditComponent } from './components/document/document-edit.component';
import { TemplateComponent } from './components/template/template.component';
import { TemplateNewComponent } from './components/template/template-new.component';
import { TemplateViewComponent } from './components/template/template-view.component';
import { TemplateEditComponent } from './components/template/template-edit.component';
import { LoginComponent } from './components/auth/login.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'templates',
        component: TemplateComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', component: TemplateNewComponent },
            { path: ':id', component: TemplateViewComponent },
            { path: ':id/edit', component: TemplateEditComponent }
        ]
    },
    {
        path: 'documents',
        component: DocumentComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DocumentNewComponent },
            { path: ':id', component: DocumentViewComponent },
            { path: ':id/edit', component: DocumentEditComponent }
        ]
    },
    { path: '**', redirectTo: '/templates' }
];

export const routing = RouterModule.forRoot(routes);
