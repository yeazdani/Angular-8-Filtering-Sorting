import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { Order } from '../shared/models/work-order.model';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss']
})
export class WorkOrdersComponent implements OnInit {
  searchName = "";
  orders: Order[] = [];
  workers: any[] = [];
  mergedArray: any[] = [];
  spinner: any = true;
  workerIds = [];
  uniqueWorkerIds = [];
  subscription: Subscription;
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.fetchWorkOrdersData();
  }

  fetchWorkOrdersData() {
    this.appService.getWorkOrders().subscribe(
      res => {
        this.orders = res.orders;
        this.fetchWorkerData();
        this.filterUniqueWorkerId();
      },
      err => {
        console.log(err)
      });
  }
  //this method filters all Unique workerIds
  filterUniqueWorkerId() {
    this.orders.forEach(res => {
      this.workerIds.push(res.workerId);
    });
    this.uniqueWorkerIds = [...new Set(this.workerIds)];
  }
  // sorts work-orders by latest
  sortOrdersByLatest() {
    this.mergedArray.sort((a, b) => b.deadline - a.deadline);
  }
  // sorts work-orders by Earliest
  sortOrdersByEarliest() {
    this.mergedArray.sort((a, b) => a.deadline - b.deadline);
  }
  // fetching all workers at once
  fetchWorkerData() {
    const workerRequests = [];
    for (let index = 0; index < this.orders.length; index++) {
      workerRequests.push(this.appService
        .getWorkers(this.orders[index].workerId));
    }
    this.subscription = forkJoin(workerRequests).subscribe(res => {
      this.workers = res;
      this.mergeOrdersAndWorkers();
    });
  }
  // this method merges orders and workers together
  mergeOrdersAndWorkers() {
    for (let index = 0; index < this.workers.length; index++) {
      const tempObj: any = {
        deadline: this.orders[index].deadline,
        description: this.orders[index].description,
        id: this.orders[index].id,
        name: this.orders[index].name,
        workerId: this.orders[index].workerId,
        companyName: this.workers[index].worker.companyName,
        email: this.workers[index].worker.email,
        wid: this.workers[index].worker.id,
        image: this.workers[index].worker.image,
        wname: this.workers[index].worker.name
      };
      this.mergedArray.push(tempObj);
    }
    this.sortOrdersByEarliest();
    this.spinner = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
