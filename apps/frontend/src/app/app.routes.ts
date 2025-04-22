import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UserListComponent } from './components/home/admin/user-list/user-list.component';
import { DistanceListComponent } from './components/home/admin/distance-list/distance-list.component';
import { ParkingListComponent } from './components/home/admin/parking-list/parking-list.component';
import { FilesComponent } from './components/home/admin/files/files.component';
import { TaskDescriptionComponent } from './components/home/driver/task-description/task-description.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'users', component: UserListComponent },
            { path: 'distances', component: DistanceListComponent },
            { path: 'parking', component: ParkingListComponent },
            { path: 'files', component: FilesComponent }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'task/:id', component: TaskDescriptionComponent},
    { path: '**', redirectTo: '/home' }
];
