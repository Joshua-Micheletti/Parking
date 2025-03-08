import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { AdminComponent } from './admin/admin.component';
import { DriverComponent } from './driver/driver.component';
import { DbadminComponent } from './dbadmin/dbadmin.component';

@Component({
  selector: 'app-home',
  imports: [AdminComponent, DriverComponent, DbadminComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public role: string = 'driver';

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.authenticated$
      .pipe(
        filter(
          (authenticated: { token: string; role: string; user: string }) => {
            return authenticated.role !== '';
          }
        )
      )
      .subscribe(
        (authenticated: { token: string; role: string; user: string }) => {
          this.role = authenticated.role;
        }
      );
  }
}
