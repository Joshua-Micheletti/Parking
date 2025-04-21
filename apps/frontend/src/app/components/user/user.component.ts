import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RainbowChipComponent } from '../rainbow-chip/rainbow-chip.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { filter } from 'rxjs';
import { Base, Role } from '../../types/user';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-user',
    imports: [MatCardModule, RainbowChipComponent, MatIconModule, TranslateModule, MatButtonModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
    public user: string = '';
    public role: Role = 'driver';
    public base: Base = 'SEV';

    constructor(
        private _authService: AuthService,
        private _translate: TranslateService,
        private _themeService: ThemeService
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
            });
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
