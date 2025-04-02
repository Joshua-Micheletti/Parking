import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '../../../../services/http.service';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Endpoint, environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-files',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './files.component.html',
    styleUrl: './files.component.scss'
})
export class FilesComponent {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    public imageSrc: string = '';

    private _imageId: string = '';

    constructor(private _httpService: HttpService) {}

    public upload(): void {
        this.fileInput.nativeElement.click();
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        const requestConfig: Endpoint = environment.endpoints?.['uploadImage'];
        console.log("🐛 | files.component.ts:31 | FilesComponent | onFileSelected | environment:", environment)
        console.log("🐛 | files.component.ts:32 | FilesComponent | onFileSelected | requestConfig:", requestConfig)

        if (!requestConfig) {
            return;
        }

        const formData: FormData = new FormData();

        if (input.files) {
            formData.append('file', input.files[0]);
        }

        const headers = new HttpHeaders({
            Accept: '*/*' // Ensures binary response is correctly handled
        });

        this._httpService
            .request(
                new HttpRequest(requestConfig.method, requestConfig.path, formData, { headers, reportProgress: true })
            )
            .subscribe({
                next: (response: any) => {
                    this._imageId = response.id;
                    this.getImage();
                },
                error: (error: unknown) => {
                    console.log(error);
                }
            });
    }

    public getImage(): void {
        if (this._imageId === '') {
            return;
        }

        const requestConfig: Endpoint = environment.endpoints?.['downloadImage'];

        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    {},
                    { params: new HttpParams().set('id', this._imageId), responseType: 'blob' }
                )
            )
            .subscribe({
                next: (response: Blob) => {
                    const objectURL = URL.createObjectURL(response);

                    this.imageSrc = objectURL;
                },
                error: (error: unknown) => {
                    console.log(error);
                }
            });
    }

    public download(): void {
        const a = document.createElement('a');
        a.href = this.imageSrc;
        a.download = 'image.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    public remove(): void {
        if (this._imageId === '') {
          return;
        }
        
        const requestConfig: Endpoint = environment.endpoints?.['deleteImage'];

        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    {},
                    { params: new HttpParams().set('id', this._imageId) }
                )
            )
            .subscribe({
                next: (response: any) => {
                    this.imageSrc = '';
                    this._imageId = '';
                },
                error: (error: unknown) => {
                    console.log(error);
                }
            });
    }
}
