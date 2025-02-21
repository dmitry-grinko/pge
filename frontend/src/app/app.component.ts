import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './modules/shared/components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, HeaderComponent]
})
export class AppComponent {}
    