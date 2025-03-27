import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  public update$: Subject<void> = new Subject<void>();

  constructor() { }
}
