import { Component, AbstractType } from '@angular/core';
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders } from  '@angular/common/http';  
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';

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
  showChart : boolean = false;
  chartTitle = 'bar-chart';
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad"];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins:any = {'backgroundColor': [
    "#FF6384",
 "#4BC0C0",
 "#FFCE56",
 "#E7E9ED",
 "#36A2EB"
 ]}
  
 public barChartColors: Color[] = [
  { backgroundColor: '#36A2EB' },
]

  barChartData: ChartDataSets[] = [];

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
  
  this.httpClient.post<any>('http://LAMU02FLEJPMD6M:5000/captureimage', formData).subscribe((response: any) => {

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
  this.showResultsGraph();

 }

 takeImgAgain() {
   this.takeImg = true;
   this.showChart = false;
 }

 showResults(){ 
   if(this.recording === false && this.takeImg === false) {
     this.showResultBtn = true;
   }
 }

 showResultsGraph() {

  this.showChart = true;
  //  const audioRes = {"matrixAudio":{"Angry":"0.47963363","Disgust":"0.026712293","Fear":"0.026157368","Happy":"0.43753773","Neutral":"0.0017231886","Sad":"0.028235815"},"resultEmotionAudio":"angry"}
  //  const imgRes = {"matrix":{"Angry":"0.569056","Disgust":"0.0029743395","Fear":"0.03964233","Happy":"0.00031003068","Neutral":"0.22370978","Sad":"0.14347604","Surprise":"0.020831546"},"resultEmotion":"Angry"}
 
  let audioRes = this.audioResposne;
  let imgRes = this.imgResponse;
  let t1 = audioRes.matrixAudio.Angry;
  let t2 = imgRes.matrix.Angry;
  let t3 = (parseFloat(t1)*0.2 + parseFloat(t2)*0.8);

  let t4 = audioRes.matrixAudio.Disgust;
  let t5 = imgRes.matrix.Disgust;
  let t6 = (parseFloat(t4)*0.2 + parseFloat(t5)*0.8);

  let t7 = audioRes.matrixAudio.Fear;
  let t8 = imgRes.matrix.Fear;
  let t9 = (parseFloat(t7)*0.2 + parseFloat(t8)*0.8);

  let t10 = audioRes.matrixAudio.Happy;
  let t11 = imgRes.matrix.Happy;
  let t12 = (parseFloat(t10)*0.2 + parseFloat(t11)*0.8);

  let t13 = audioRes.matrixAudio.Neutral;
  let t14 = imgRes.matrix.Neutral;
  let t15 = (parseFloat(t13)*0.2 + parseFloat(t14)*0.8);

  let t16 = audioRes.matrixAudio.Sad;
  let t17 = imgRes.matrix.Sad;
  let t18 = (parseFloat(t16)*0.2 + parseFloat(t17)*0.8);

  
  const finalRes = {"matrix":{"Angry":t3,"Disgust":t6,"Fear":t9,"Happy":t12,"Neutral":t15,"Sad":18,"Surprise":"0.020831546"},"resultEmotion":"Angry"};

  this.barChartData = [ { data: [t3,t6,t9,t12,t15,t18],label: "emotions"}]
 }

}
