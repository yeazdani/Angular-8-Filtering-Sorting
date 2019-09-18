import { AppService } from './shared/services/app.service';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  checkboxFlag: any = false;
  searchName: any = "";
  @ViewChild(WorkOrdersComponent, { static: false })
  private workOrderComponent: WorkOrdersComponent;

  constructor(private appService: AppService) { }
  // calls Earliest and Latest sort Methods on Switch Button change
  checkBoxChange() {
    this.checkboxFlag ? this.workOrderComponent.sortOrdersByLatest()
      : this.workOrderComponent.sortOrdersByEarliest();
  }

  seachInputValueChange() {
    this.workOrderComponent.searchName = this.searchName;
  }

}

