import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserComponent } from '../../user/user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { TaskCardComponent } from "./task-card/task-card.component";

@Component({
    selector: 'app-driver',
    imports: [MatIconModule, MatMenuModule, UserComponent, MatButtonModule, MatExpansionModule, MatCardModule, TaskCardComponent],
    templateUrl: './driver.component.html',
    styleUrl: './driver.component.scss'
})
export class DriverComponent {
    public openTasks = false;
    public openCompleted = false;
    
    readonly panelOpenState = signal(false);
}
