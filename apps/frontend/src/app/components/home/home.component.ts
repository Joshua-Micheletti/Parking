import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { RainbowChipComponent } from "../rainbow-chip/rainbow-chip.component";
import { Base, Role } from '../../types/user';

@Component({
    selector: 'app-home',
    imports: [
    MatSidenavModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    RouterOutlet,
    RouterModule,
    MatChipsModule,
    RainbowChipComponent
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    public user: string = '';

    public features: { icon: string; name: string; path?: string }[] = [
        { icon: 'group', name: 'Users', path: 'users' },
        { icon: 'directions_car_filled', name: 'Parking', path: 'parking' },
        { icon: 'work', name: 'Distances', path: 'distances' }
    ];

    public role: Role = 'driver';
    public base: Base = 'SEV';
    public isExpanded: boolean = true;

    constructor(private _authService: AuthService, private _router: Router) {}

    ngOnInit(): void {
        this._authService.authenticated$
            .pipe(
                filter((authenticated: { token: string; role: Role; user: string; base: Base }) => {
                    return authenticated.token !== '';
                })
            )
            .subscribe((authenticated: { token: string; role: Role; user: string; base: Base }) => {
                this.role = authenticated.role;
                this.user = authenticated.user;
                this.base = authenticated.base;
            });
    }

    public openSidenav(): void {
        this.sidenav.open();
    }

    public closeSidenav(): void {
        this.sidenav.close();
    }

    public selectFeature(path: string): void {
        this._router.navigate(['home/' + path]);
    }

    public logout(): void {
        this._authService.logout();
    }
}
