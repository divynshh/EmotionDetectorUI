import { Component, AbstractType } from '@angular/core';
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders } from  '@angular/common/http';  
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'emotionDetectorUI';

  takeImg = true;
  imgResponse : any;
  audioResposne : any;
  public webcamImage: WebcamImage = null;
  public trigger: Subject<void> = new Subject<void>();
  blob: any;
  showResultBtn : boolean = false;
  
  triggerSnapshot(): void {
   this.trigger.next();
   this.uploadForm.get('image').setValue(this.webcamImage);
  }

  handleImage(webcamImage: WebcamImage): void {
    this.takeImg=false;
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
   }
    
   public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
   }

   public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

//Lets declare Record OBJ
record;
//Will use this flag for toggeling recording
recording = false;
//URL of Blob
url;
error;
uploadForm: FormGroup; 
constructor(private domSanitizer: DomSanitizer,private httpClient: HttpClient,private formBuilder: FormBuilder) {}
  
ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      image: ['']
    });
  }
sanitize(url: string) {
return this.domSanitizer.bypassSecurityTrustUrl(url);
}
/**
* Start recording.
*/
initiateRecording() {
  this.url = null;
this.recording = true;
let mediaConstraints = {
video: false,
audio: true
};
navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
}
/**
* Will be called automatically.
*/
successCallback(stream) {
var options = {
mimeType: "audio/wav",
numberOfAudioChannels: 2
};
//Start Actuall Recording
var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
this.record = new StereoAudioRecorder(stream, options);
this.record.record();
}
/**
* Stop recording.
*/
stopRecording() {
this.recording = false;
this.record.stop(this.processRecording.bind(this));
this.showResults()
}

processRecording(blob) {
  this.blob=blob;
this.url = URL.createObjectURL(blob);
console.log("blob", blob);
console.log("url", this.url);
}

errorCallback(error) {
this.error = 'Can not play audio in your browser';
}
 public uploadimage(){
  const formData = new FormData();
  formData.append('image', this.webcamImage.imageAsDataUrl);
  
  this.httpClient.post<any>('http://127.0.0.1:5000/captureimage', formData).subscribe((response: any) => {

    // (res) => console.log(res),
    // (err) => console.log(err)

    this.imgResponse = response;
    console.log(this.imgResponse)

  });
   
 }

 public uploadaudio(){
  const formData = new FormData();
  formData.append('file', this.blob);
  
  this.httpClient.post<any>('http://127.0.0.1:5000/captureaudio', formData).subscribe((response: any) => {
    // (res) => console.log(res),
    // (err) => console.log(err)

    this.audioResposne = response;
    console.log(this.audioResposne)
    
  });

 }

 getPredictedEmotion(){

  this.uploadimage();
  this.uploadaudio();

 }

 takeImgAgain() {
   this.takeImg = true;
 }

 showResults(){ 
   if(this.recording === false && this.takeImg === false) {
     this.showResultBtn = true;
   }
 }

}
