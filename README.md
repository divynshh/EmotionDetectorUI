# EmotionDetectorUI

Emotion Detector UI is built on Angular , The webapp uses the webcam and microphone which captures and face image and a speech sample and passes it to a python -flask server, which is fed to a ML trained model and then it returns a matrix of emotion .

# Prerequisites

Both the Angular CLI and generated project have dependencies that require Node 14.17.0 or higher, together with NPM 7.17.0 or higher.
## Angular Installation
### Install Globally

```bash
npm install -g @angular/cli
```


## Get the Code
```
git clone 'https://github.optum.com/dchauh24/EmotionDetectorUI'
cd EmotionDetectorUI
npm i
npm install --save @angular/material @angular/cdk
```

## Run the flask app to enable web service. 
```
git clone 'https://github.optum.com/dchauh24/EmotionDetection-Backend'
export FLASK_APP=flask_app
flask run --host=0.0.0.0
```

## Running the app

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.






