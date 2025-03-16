import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UserListComponent } from './components/home/admin/user-list/user-list.component';
import { DistanceListComponent } from './components/home/admin/distance-list/distance-list.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
        {path: 'users', component: UserListComponent},
        {path: 'distances', component: DistanceListComponent}
    ]},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: '/home'},
];
