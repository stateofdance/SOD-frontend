import { Component, inject, OnInit, signal } from '@angular/core';
import { Package } from '../../interfaces/package';
import { NgClass } from "@angular/common";
import { LessonService } from '../../services/lesson-service';
import { AppState } from '../../services/app-state';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Branch } from '../../interfaces/branch';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-package-page',
  imports: [NgClass, ReactiveFormsModule,],
  templateUrl: './package-page.html',
  styleUrl: './package-page.css',
})
export class PackagePage implements OnInit{
  protected account_service = inject(AccountService); 
  protected service = inject(LessonService);
  protected state = inject(AppState);

  packages = signal<Package[]>([]);
  selected_package:number = -1;
  hovered_package:number = -1;
  paying = false;

  branch = new FormControl(1);
  branches = signal<Branch[]>([]);


  ngOnInit(): void {
    this.service.get_packages().then(packages => {
      this.packages.set(packages);
      this.packages().sort((a, b) => a.number_of_sessions - b.number_of_sessions);
    });

  this.account_service.get_branches().then(branches => {
      this.branches.set(branches);
      this.branch.setValue(branches[0].id);
    }).catch((error) => {
        if (error.status === 401) {
          console.log('Unauthorized: token is invalid or expired. Logging out...');
          localStorage.removeItem('authToken');
          this.state.user.set(null);
          window.dispatchEvent(new Event('force-login'));
        } else { 
          console.log(error.message);
        }
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
    this.service.order_ticket(this.selected_package, this.state.user()!.authToken!)
    .then(checkout_url => {window.open(checkout_url);})
    .finally(() => {this.paying = false;})
    .catch((error) => {
        if (error.status === 401) {
          console.log('Unauthorized: token is invalid or expired. Logging out...');
          localStorage.removeItem('authToken');
          this.state.user.set(null);
          window.dispatchEvent(new Event('force-login'));
        } else { 
          console.log(error.message);
        }
    });
  }
}
