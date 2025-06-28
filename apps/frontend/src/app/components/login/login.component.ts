import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-login',
    imports: [
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    public form: FormGroup = new FormGroup({});
    public passwordType: string = 'password';

    constructor(private _authService: AuthService, private _themeService: ThemeService, private _translateService: TranslateService) {}

    ngOnInit(): void {
        this.form.addControl('username', new FormControl('', [Validators.required]));
        this.form.addControl('password', new FormControl('', [Validators.required]));
    }

    public onLogin(): void {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

        this._authService.login(this.form.value);
    }

    public getTheme(): string {
        return this._themeService.currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
    }

    public switchTheme(): void {
        this._themeService.switchTheme();
    }

    public switchLanguage(): void {
        this._translateService.currentLang === 'en' ? this._translateService.use('es') : this._translateService.use('en');
    }

    public getLanguage(): string {
        return this._translateService.currentLang.toUpperCase();
    }
}
