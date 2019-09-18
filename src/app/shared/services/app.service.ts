import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  workOrdersApi = "https://www.hatchways.io/api/assessment/work_orders";
  workersApi = "https://www.hatchways.io/api/assessment/workers/";

  workers: Worker[] = [];
  constructor(private http: HttpClient) { }

  getWorkOrders() {
    return this.http.get<any>(this.workOrdersApi);
  }
  getWorkers(id: any) {
    return this.http.get<any>(this.workersApi + id);
  }
}
