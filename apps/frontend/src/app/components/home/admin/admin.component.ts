import { Component } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-admin',
  imports: [UserListComponent, MatTabsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor() { }
}
