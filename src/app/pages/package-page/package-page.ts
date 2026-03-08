import { Component, inject, OnInit, signal } from '@angular/core';
import { Package } from '../../interfaces/package';
import { NgClass } from "@angular/common";
import { LessonService } from '../../services/lesson-service';
import { AppState } from '../../services/app-state';

@Component({
  selector: 'app-package-page',
  imports: [NgClass],
  templateUrl: './package-page.html',
  styleUrl: './package-page.css',
})
export class PackagePage implements OnInit{
  protected service = inject(LessonService);
  protected state = inject(AppState);

  packages = signal<Package[]>([]);
  selected_package:number = -1;
  hovered_package:number = -1;
  paying = false;

  ngOnInit(): void {
    this.service.get_packages().then(packages => {
      this.packages.set(packages);
      this.packages().sort((a, b) => a.number_of_sessions - b.number_of_sessions);
    });
  }

  is_hovered(package_id:number):boolean {
    return package_id == this.hovered_package || package_id == this.selected_package;
  }

  payment() {
    if (this.paying) return;

    if (this.selected_package == -1) {
      alert('Please select a package before proceeding.');
      return;
    }
    
    this.paying = true;
    this.service.order_ticket(this.selected_package, this.state.user()!.authToken!).then(checkout_url => window.open(checkout_url)).finally(() => {this.paying = false;});
  }
}
