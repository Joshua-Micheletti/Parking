import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, HttpClientModule, RouterModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  public isLoading: boolean = false;

  constructor(private _loadingService: LoadingService) {
    this._loadingService.loading.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }
}
