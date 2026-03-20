import { Component, inject, OnInit, signal } from '@angular/core';
import { Package } from '../../interfaces/package';
import { NgClass } from "@angular/common";
import { LessonService } from '../../services/lesson-service';
import { AppState } from '../../services/app-state';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Branch } from '../../interfaces/branch';
import { AccountService } from '../../services/account-service';
import { Recital } from '../../interfaces/recital';

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
  recitals = signal<Recital[]>([]);
  selected_package:number = -1;
  hovered_package:number = -1;
  hovered_section:string = '';
  section:string = '';
  paying = false;

  branch = new FormControl(1);
  branches = signal<Branch[]>([]);


  ngOnInit(): void {
    this.service.get_packages(this.branch.value!).then(packages => {
      this.packages.set(packages);
      this.packages().sort((a, b) => a.number_of_sessions - b.number_of_sessions);
    });
    this.service.get_recitals(this.branch.value!).then(recitals => {
      this.recitals.set(recitals);
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

    this.branch.valueChanges.subscribe(value => {
      this.service.get_packages(this.branch.value!).then(packages => {
        this.packages.set(packages);
        this.packages().sort((a, b) => a.number_of_sessions - b.number_of_sessions);
      });
      this.service.get_recitals(this.branch.value!).then(recitals => {
        this.recitals.set(recitals);
      });
    });
  }
  
  set_hover(package_id:number, section:string) {
    this.hovered_package = package_id;
    this.hovered_section = section;
  }

  clicked_recital(recital:Recital) {
    if (this.recital_is_full(recital)) return;
    
    this.selected_package = recital.id; 
    this.section = 'recitals';
  }

  recital_is_full(recital: Recital):Boolean {
    return recital.students.length >= recital.max_students || recital.students.includes(this.state.user()?.id!);
  }

  is_hovered(package_id:number, section:string):boolean {
    return (package_id == this.hovered_package && section == this.hovered_section) || (package_id == this.selected_package && this.section == section);
  }

  payment() {
    if (this.paying) return;

    const user = this.state.user();
    const token = user?.authToken;

    if (!user || !token) {
      window.dispatchEvent(new Event('force-login'));
      return;
    }

    if (this.selected_package == -1) {
      alert('Please select a package before proceeding.');
      return;
    }

    this.paying = true;

    if (this.section == 'packages') {
      this.service.order_ticket(this.selected_package, token)
        .then(checkout_url => {
          window.open(checkout_url);
        })
        .finally(() => {
          this.paying = false;
        })
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
    } else {
      for (const recital of this.recitals()) {
        if (recital.id == this.selected_package && recital.students.length >= recital.max_students) {
          alert('The recital is already full! Pick a different recital');
          this.paying = false;
          return;
        }
      }

      this.service.book_recital(this.selected_package, token)
        .then(checkout_url => {
          window.open(checkout_url);
        })
        .finally(() => {
          this.paying = false;
        })
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

}
