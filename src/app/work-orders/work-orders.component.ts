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
        this.filterUniqueWorkerId();
        this.fetchWorkerData();
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
  // fetching all workers data of unique workerIds.
  // Hence, this method will reduce/optimize http requests
  fetchWorkerData() {
    const workerRequests = [];
    for (let index = 0; index < this.uniqueWorkerIds.length; index++) {
      workerRequests.push(this.appService
        .getWorkers(this.uniqueWorkerIds[index]));
    }
    //forkJoin hadles multiple observables
    this.subscription = forkJoin(workerRequests).subscribe(res => {
      this.workers = res;
      this.mergeOrdersAndWorkers();
    });
  }

  //this method merges orders and workers together
  //also merges according to their worker ids
  mergeOrdersAndWorkers() {
    for (let i = 0; i < this.orders.length; i++) {
      for (let j = 0; j < this.workers.length; j++) {
        if (this.orders[i].workerId === this.workers[j].worker.id) {
          const tempObj: any = {
            deadline: this.orders[i].deadline,
            description: this.orders[i].description,
            id: this.orders[i].id,
            name: this.orders[i].name,
            workerId: this.orders[i].workerId,
            companyName: this.workers[j].worker.companyName,
            email: this.workers[j].worker.email,
            wid: this.workers[j].worker.id,
            image: this.workers[j].worker.image,
            wname: this.workers[j].worker.name
          };
          this.mergedArray.push(tempObj);
        }
      }
    }
    this.sortOrdersByEarliest();
    this.spinner = false;
  }

  //all objects except singletons, 
  //should be unsubscribed before the component's destruction
  //it reduces memory leaks
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
