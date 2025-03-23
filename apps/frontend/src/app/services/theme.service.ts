import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _currentTheme: 'dark' | 'light' = 'dark';

  constructor() { }

  public switchTheme() {
    this._currentTheme === 'dark' ? this._currentTheme = 'light' : this._currentTheme = 'dark';

    const body = document.body;

    if (this._currentTheme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }

  public get currentTheme(): 'dark' | 'light' {
    return this._currentTheme;
  }
}
