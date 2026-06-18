// usa RouterLink para navegar a cada sección
// las cards se generan dinámicamente con el array menuItems
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  // cada item tiene el título, descripción, ícono de bootstrap icons y ruta
  menuItems = [
    {
      title: 'Portal de Películas',
      description: 'Top 100 películas según IMDB. Filtrá por título o género.',
      icon: 'bi-film',
      route: '/movies'
    },
    {
      title: 'Car Maker',
      description: 'Explorá marcas y modelos de autos de todo el mundo.',
      icon: 'bi-car-front-fill',
      route: '/cars'
    },
    {
      title: 'Conversor de Divisas',
      description: 'Convertí entre más de 160 monedas en tiempo real.',
      icon: 'bi-currency-exchange',
      route: '/currency'
    },
    {
      title: 'Texto a Audio',
      description: 'Convertí cualquier texto a audio con distintas voces de IA.',
      icon: 'bi-volume-up-fill',
      route: '/tts'
    },
    {
      title: 'Clima por Ciudad',
      description: 'Consultá el clima actual de cualquier ciudad del mundo.',
      icon: 'bi-cloud-sun-fill',
      route: '/weather'
    }
  ];
}
