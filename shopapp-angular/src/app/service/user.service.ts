import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { UserResponse } from '../reponses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { environment } from '../environments/environment';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/users`;
  private apiRegister = "http://localhost:8080/api/v1/users/register";
  private apiLogin = "http://localhost:8080/api/v1/users/login";
  private apiUserDetail = "http://localhost:8080/api/v1/users/details";
  private apiConfig = {
    headers: this.createHeaders(),
  }

  constructor(private http: HttpClient) { }
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({'Content-Type': 'application/json'});
  }

  register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig)
  }
  login(loginDTO: LoginDTO):Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig)
  }

  getUsers(keyword: string, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
        .set('keyword', keyword)
        .set('page', page.toString())
        .set('limit', limit.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  activateUser(userId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/users/${userId}`;
    return this.http.put<any>(url, {}, { responseType: 'text' as 'json' });
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/users/${userId}`;
    return this.http.delete<any>(url, { responseType: 'text' as 'json' });
  }

  getUserDetail(token: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUserDetail, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    debugger
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  
  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      debugger
      if(userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      localStorage.setItem('user', userResponseJSON);
      console.log('User response saved to local storage');
    } catch (error) {
      console.log('Error saving user response to local storage: ', error);
    }
  }

  getUserResponseFromLocalStorage():UserResponse | null{
    try {
      const userResponseJSON = localStorage.getItem('user')
      if(userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      
      console.log('User response retrieved from local storage');
      return userResponse;
    } catch (error) {
      console.log('Error saving user response to local storage: ', error);
      return null;
    }
  }

  removeUserFromLocalStorage(): void {
    try {
      localStorage.removeItem('user');
      console.log('User data removed from local storage');
    } catch (error) {
      console.error('Error removing user from local storage: ', error);
    }
  }
}
