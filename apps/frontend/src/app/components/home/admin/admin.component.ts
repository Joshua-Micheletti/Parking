import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpService } from '../../../services/http.service';
import { Endpoint, environment } from '../../../../environments/environment';
import { HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [UserListComponent, MatTabsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  constructor(private _httpService: HttpService) { }

  ngOnInit(): void {
    console.log('initialized');
    const requestConfig: Endpoint = environment.endpoints['getUsers'];

    if (requestConfig) {
      this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
        next: (response: unknown) => {
          console.log('Users', response);
        },
        error: (error: any) => {
          console.log('Could not get users', error);
        }
      });
    }
  }
}
