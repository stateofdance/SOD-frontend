import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { CoachesPage } from './pages/coaches-page/coaches-page';

export const routes: Routes = [
    { path:'', component:LandingPage, title:'State of Dance' },
    { path:'coaches', component:CoachesPage, title: 'Coaches' }
];
