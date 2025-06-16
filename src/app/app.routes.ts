import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full', 
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent),
        title: 'Inicio de sesión'
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin-componente/admin-componente').then(m => m.AdminComponente),
        title: 'Administración'
    },
    {
        path: 'restore-password',
        loadComponent: () => import('./components/restore-password/restore-password').then(m => m.RestorePassword),
        title: 'Restaurar contraseña'
    }
];
