import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { ConversationItem } from '../types';

interface ListeningComponentProps {
  onInputReceived: (text: string) => void;
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListeningComponent: React.FC<ListeningComponentProps> = ({
  onInputReceived,
  isListening,
  setIsListening
}) => {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    if (transcript) {
      onInputReceived(transcript);
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default ListeningComponent;
