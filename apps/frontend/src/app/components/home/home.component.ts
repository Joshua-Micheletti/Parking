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
import { RainbowChipComponent } from '../rainbow-chip/rainbow-chip.component';
import { Base, Role } from '../../types/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../services/theme.service';
import { HttpService } from '../../services/http.service';
import { Endpoint, environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

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
        RainbowChipComponent,
        TranslateModule,
        MatMenuModule
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
        { icon: 'work', name: 'distances', path: 'distances' }
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

    public uploadImage(): void {
        this.fileInput.nativeElement.click();
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        const requestConfig: Endpoint = environment.endpoints?.['uploadImage'];

        if (!requestConfig) {
            return;
        }

        const formData: FormData = new FormData();

        if (input.files) {
            formData.append('file', input.files[0]);
        }

        const headers = new HttpHeaders({
            Accept: '*/*' // Ensures binary response is correctly handled
        });

        this._httpService
            .request(
                new HttpRequest(requestConfig.method, requestConfig.path, formData, { headers, reportProgress: true })
            )
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                    this._imageId = response.id;
                },
                error: (error: unknown) => {
                    console.log(error);
                }
            });
    }

    public downloadImage(): void {
        const requestConfig: Endpoint = environment.endpoints?.['downloadImage'];

        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    { responseType: 'blob', reportProgres: true },
                    { params: new HttpParams().set('id', this._imageId) }
                )
            )
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                    const blob = response.body as Blob;
                    const objectURL = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = objectURL;
                    a.download = 'downloaded-image.jpg';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(objectURL);
                },
                error: (error: unknown) => {
                    console.log(error);
                }
            });
    }
}
