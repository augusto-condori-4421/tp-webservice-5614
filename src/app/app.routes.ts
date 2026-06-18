import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./pages/movies-portal/movies-portal.component')
        .then(m => m.MoviesPortalComponent)
  },
  {
    path: 'cars',
    loadComponent: () =>
      import('./pages/car-maker/car-maker.component')
        .then(m => m.CarMakerComponent)
  },
  {
    path: 'currency',
    loadComponent: () =>
      import('./pages/currency-converter/currency-converter.component')
        .then(m => m.CurrencyConverterComponent)
  },
  {
    path: 'tts',
    loadComponent: () =>
      import('./pages/text-to-speech/text-to-speech.component')
        .then(m => m.TextToSpeechComponent)
  },
  {
    path: 'weather',
    loadComponent: () =>
      import('./pages/weather/weather.component')
        .then(m => m.WeatherComponent)
  },
  {
    path: 'recipes',
    loadComponent: () =>
      import('./pages/recipes/recipes.component')
        .then(m => m.RecipesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
