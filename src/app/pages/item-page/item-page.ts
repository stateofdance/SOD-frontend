import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MerchItem } from '../../interfaces/merch-item';
import { StoreService } from '../../services/store-service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MerchCustomization } from '../../interfaces/merch-customization';
import { Branch } from '../../interfaces/branch';
import { AccountService } from '../../services/account-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../services/app-state';

@Component({
  selector: 'app-item-page',
  imports: [ReactiveFormsModule],
  templateUrl: './item-page.html',
  styleUrl: './item-page.css',
})
export class ItemPage implements OnInit{
  protected service = inject(StoreService);
  protected accountService = inject(AccountService);
  protected state = inject(AppState);

  id = signal<number|null>(null);
  item = signal<MerchItem|null>(null);
  customizations = signal<{customizationName:string, customizations:MerchCustomization[]}[]>([]);
  branches = signal<Branch[]>([]);
  current_index = signal<number>(0);
  counter = signal<number>(1);
  branch = new FormControl("None");
  custom_form = new FormGroup({});
  added_prices = new Map<string, string>();
  final_price = 0;
  paying = false;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.id.set(parseInt(id));
      }
      console.log(this.id());
    })

    this.accountService.get_branches().then(branches => this.branches.set(branches));

    if (this.id()) {
      this.service.get_merch(this.id()!).then(merchItem => {
        this.service.get_merch_images(this.id()!).then(images => {
          merchItem.image_links = images;
          this.item.set(merchItem);
          this.final_price = parseFloat(merchItem.price);
        });

        this.service.get_merch_customizations(this.id()!).then(customizations => {
          this.customizations.set(customizations);
          for (const customization of customizations) {
            this.custom_form.addControl(customization.customizationName, new FormControl("None"))
            this.custom_form.get(customization.customizationName)?.valueChanges.subscribe(customizationId => {
              if (customizationId == 'None') return;
              for (const choice of customization.customizations) {
                if (parseInt(customizationId) == choice.id) {
                  this.added_prices.set(customization.customizationName, choice.addedPrice +'');
                }
              }
              this.final_price = parseFloat(this.item()!.price) + Array.from(this.added_prices.values()).reduce((accumulator, current_value) => accumulator + parseFloat(current_value), 0);
            })
          }
        })
      });
    }
  }

  next() {
    if (this.current_index() == this.item()!.image_links.length - 1) {return;}
    this.current_index.set(this.current_index() + 1);
  }

  previous() {
    if (this.current_index() == 0) {return;}
    this.current_index.set(this.current_index() - 1);
  }

  add() {
    this.counter.set(this.counter() + 1);
  }

  subtract() {
    if (this.counter() == 1) {return;}
    this.counter.set(this.counter() - 1)
  }

  submit() {
    if (this.paying) return;

    if (this.branch.value == "None") {
      alert("Please select a branch.");
      return;
    }
    if (this.custom_form.value && Object.values(this.custom_form.value).includes("None")) {
      alert("Please select all customizations.");
      return;
    }

    this.paying = true;
    this.service.submit_order(
      this.item()?.id!, Object.values(this.custom_form.value).map(Number), 
      this.counter(), parseInt(this.branch.value!), this.state.user()?.authToken!
    ).then(link => window.open(link)).finally(() => {this.paying = false;});
  }
}
