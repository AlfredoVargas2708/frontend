import { Routes } from '@angular/router';
import { EmailExistsGuard } from './guards/email-exists.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login-components/login-component/login-component').then(m => m.LoginComponent),
        title: 'Inicio de sesión',
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin-componente/admin-componente').then(m => m.AdminComponente),
        title: 'Administración',
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full',
            },
            {
                path: 'products',
                loadComponent: () => import('./components/admin-componente/products/products').then(m => m.Products),
                title: 'Productos',
            },
            {
                path: 'sales',
                loadComponent: () => import('./components/admin-componente/sales/sales').then(m => m.Sales),
                title: 'Ventas',
            }
        ]
    },
    {
        path: 'restore-password',
        loadComponent: () => import('./components/restore-password/restore-password').then(m => m.RestorePassword),
        title: 'Restaurar contraseña',
        canActivate: [EmailExistsGuard]
    },
    {
        path: 'employee',
        loadComponent: () => import('./components/employee-component/employee-component').then(m => m.EmployeeComponent),
        title: 'Empleado',
    },
    {
        path: 'confirm-email/:email',
        loadComponent: () => import('./components/login-components/confirmation-component/confirmation-component').then(m => m.ConfirmationComponent),
        title: 'Confirmación',
        canActivate: [EmailExistsGuard]
    },
    {
        path: 'email-not-found',
        loadComponent: () => import('./components/login-components/email-not-found/email-not-found').then(m => m.EmailNotFound),
        title: 'Email no encontrado'
    },
    {
        path: 'email-not-verified/:email',
        loadComponent: () => import('./components/login-components/email-not-verified/email-not-verified').then(m => m.EmailNotVerified),
        title: 'Email no verificado',
    }
];
