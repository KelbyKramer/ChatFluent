import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

class AzureSpeechService {
  private speechConfig: speechsdk.SpeechConfig;
  private recognizer: speechsdk.SpeechRecognizer | null = null;

  constructor() {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_REGION;

    if (!speechKey || !speechRegion) {
      throw new Error('Azure Speech credentials not found in environment variables');
    }

    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );
  }

  startRecognition(language: string, 
    onRecognizing: (text: string) => void,
    onRecognized: (text: string) => void,
    onError: (error: string) => void) {
    
    // Set the language
    this.speechConfig.speechRecognitionLanguage = language;

    // Create the audio config
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();

    // Create the recognizer
    this.recognizer = new speechsdk.SpeechRecognizer(
      this.speechConfig,
      audioConfig
    );

    // Setup event handlers
    this.recognizer.recognizing = (_, event) => {
      onRecognizing(event.result.text);
    };

    this.recognizer.recognized = (_, event) => {
      if (event.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        onRecognized(event.result.text);
      }
    };

    this.recognizer.canceled = (_, event) => {
      onError(`Error: ${event.errorDetails}`);
    };

    // Start continuous recognition
    this.recognizer.startContinuousRecognitionAsync();
  }

  stopRecognition() {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync();
      this.recognizer = null;
    }
  }
}

export default new AzureSpeechService();
