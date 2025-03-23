import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, HttpClientModule, RouterModule, TranslateModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  public isLoading: boolean = false;

  constructor(private _loadingService: LoadingService, private _translate: TranslateService) {
    this._translate.addLangs(['es', 'en']);
    this._translate.setDefaultLang('es');
    this._translate.use('es');

    this._loadingService.loading.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }
}
