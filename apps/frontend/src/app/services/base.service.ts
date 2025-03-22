import { Injectable } from '@angular/core';
import { Base } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private _bases: Base[] = ['SEV', 'BCN', 'MAD', 'MLG', 'VLC'];
  private _currentBase: Base = 'SEV';

  constructor() { }

  public get currentBase(): Base {
    return this._currentBase;
  }

  public set currentBase(base: Base) {
    this._currentBase = base;
  }

  public get bases(): Base[] {
    return this._bases;
  }
}
