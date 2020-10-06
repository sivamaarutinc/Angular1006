import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getData(key: string): any {
    return window.sessionStorage[key];
  }
  saveData(key: string, value: any): void {
    window.sessionStorage[key] = value;
  }
  removeData(key: string): void {
    window.sessionStorage.removeItem(key);
  }
  clearStorage() {
    window.sessionStorage.clear();
  }

  removeDataBeforeB2C(): void {
    window.sessionStorage.removeItem('claim');
    window.sessionStorage.removeItem('claimId');
    window.sessionStorage.removeItem('access_token');
    window.sessionStorage.removeItem('dateOfBirth');
    window.sessionStorage.removeItem('referenceNumber');
    localStorage.removeItem('audiogramDocumentsList');
    localStorage.removeItem('claimDocumentsList');

  }
}
