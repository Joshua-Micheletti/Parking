import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpService } from '../../../services/http.service';
import { Endpoint, environment } from '../../../../environments/environment';
import { HttpRequest } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin',
  imports: [UserListComponent, MatTabsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  constructor(private _httpService: HttpService, private _usersService: UserService) { }

  ngOnInit(): void {
    console.log('initialized');
  }
}
