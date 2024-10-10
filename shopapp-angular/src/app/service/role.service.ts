import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiGetRoles = `http://localhost:8080/api/v1/roles`;

    constructor(private http: HttpClient) {}
        getRoles(): Observable<any> {
            return this.http.get<any[]>(this.apiGetRoles);
        }
    
}