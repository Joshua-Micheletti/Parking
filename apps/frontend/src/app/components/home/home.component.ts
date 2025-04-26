import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { Base, Role } from '../../types/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../services/theme.service';
import { HttpService } from '../../services/http.service';
import { DriverComponent } from './driver/driver.component';
import { UserComponent } from '../user/user.component';

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
        TranslateModule,
        MatMenuModule,
        DriverComponent,
        UserComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    public user: string = '';
    public menuIsOpen: boolean = false;

    public features: { icon: string; name: string; path?: string }[] = [
        { icon: 'group', name: 'users', path: 'users' },
        { icon: 'directions_car_filled', name: 'parking', path: 'parking' },
        { icon: 'insert_drive_file', name: 'files', path: 'files' }
    ];

    public role: Role = 'driver';
    public base: Base = 'SEV';
    public isExpanded: boolean = true;

    private _imageId: string = '';

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _translate: TranslateService,
        private _themeService: ThemeService,
        private _httpService: HttpService
    ) {}

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

                if (this.role === 'admin') {
                    this.features.push({ icon: 'work', name: 'distances', path: 'distances' });
                    this.features.push({ icon: 'directions_car_filled', name: 'carPool', path: 'carPool'});
                }
            });
    }

    public openSidenav(): void {
        this.sidenav.open();
    }

    public closeSidenav(): void {
        if (!this.menuIsOpen) {
            this.sidenav.close();
        }
    }

    public selectFeature(path: string): void {
        this._router.navigate(['home/' + path]);
    }

    public logout(): void {
        this._authService.logout();
    }

    public switchLanguage(): void {
        this._translate.currentLang === 'en' ? this._translate.use('es') : this._translate.use('en');
    }

    public getLanguage(): string {
        return this._translate.currentLang.toUpperCase();
    }

    public switchTheme(): void {
        this._themeService.switchTheme();
    }

    public getTheme(): string {
        return this._themeService.currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
    }    
}
