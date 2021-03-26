import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smaki-maki';

  headerStatus: boolean;

  lat = 51.678418;
  lng = 7.809007;

  checkHeaderStatus(status: boolean): void {
    this.headerStatus = status;
  }
}
