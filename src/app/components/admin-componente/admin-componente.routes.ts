import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard'
    },
    {
        path: 'products',
        loadComponent: () => import('./products/products').then(m => m.Products),
        title: 'Productos'
    },
    {
        path: 'sales',
        loadComponent: () => import('./sales/sales').then(m => m.Sales),
        title: 'Ventas'
    }
]