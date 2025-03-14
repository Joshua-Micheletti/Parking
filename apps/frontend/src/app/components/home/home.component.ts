import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { AdminComponent } from './admin/admin.component';
import { DriverComponent } from './driver/driver.component';
import { DbadminComponent } from './dbadmin/dbadmin.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [
        AdminComponent,
        DriverComponent,
        DbadminComponent,
        MatSidenavModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatRippleModule,
        RouterOutlet,
        RouterModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    @ViewChild('sidenav') sidenav!: MatSidenav;

    public features: { icon: string; name: string; path?: string }[] = [
        { icon: 'group', name: 'Users', path: 'users' },
        { icon: 'dataset', name: 'Data' },
        { icon: 'directions_car_filled', name: 'Parking' }
    ];

    public role: string = 'driver';
    public isExpanded: boolean = true;

    constructor(private _authService: AuthService, private _router: Router) {}

    ngOnInit(): void {
        this._authService.authenticated$
            .pipe(
                filter((authenticated: { token: string; role: string; user: string }) => {
                    return authenticated.role !== '';
                })
            )
            .subscribe((authenticated: { token: string; role: string; user: string }) => {
                this.role = authenticated.role;
            });
    }

    public openSidenav(): void {
        this.sidenav.open();
    }

    public closeSidenav(): void {
        this.sidenav.close();
        // this.sidenav.open();
    }

    public selectFeature(path: string): void {
        console.log('NAVIGATE');
        this._router.navigate(['home/' + path]);
    }
}
