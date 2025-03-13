import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { AdminComponent } from './admin/admin.component';
import { DriverComponent } from './driver/driver.component';
import { DbadminComponent } from './dbadmin/dbadmin.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-home',
    imports: [AdminComponent, DriverComponent, DbadminComponent, MatSidenavModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    public role: string = 'driver';
    public isExpanded: boolean = true;

    constructor(private _authService: AuthService) {}

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

    toggleSidenav(): void {
        this.sidenav.toggle();
    }

    expandSidenav(): void {
      console.log('expand');
      this.isExpanded=true;
    }

    collapseSidenav(): void {
      console.log('collapse');
      this.isExpanded=true;
    }
}
