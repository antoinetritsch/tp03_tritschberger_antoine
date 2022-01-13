import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/Item';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  @Output() setList = new EventEmitter();

  searchbarForm: FormGroup;
  subscription: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService
  ) {
    this.searchbarForm = this.formBuilder.group({
      research: ['']
    });
  }

  updateList(list: Item[]) {
    this.setList.emit(list);
  }

  ngOnInit(): void {
    this.subscription = this.listService.getList().subscribe((list: Item[]) => {
      this.updateList(list);
    });
  }

  handleResearch(): void {
    this.subscription = this.listService.getList().subscribe((list: Item[]) => {
      if (this.searchbarForm.value.research) {
        list = list.filter((item: Item) => {
          return item.color
            .toLowerCase()
            .includes(this.searchbarForm.value.research.toLowerCase());
        });
      }
      this.updateList(list);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
