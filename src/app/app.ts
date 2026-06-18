// shell de la app: header, router-outlet y footer
// AOS se inicializa aquí para que las animaciones funcionen en toda la app
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    // inicio AOS para las animaciones de entrada en toda la app
    AOS.init({
      duration: 700,
      once: true
    });
  }
}
