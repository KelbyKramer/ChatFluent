import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import azureSpeech from '../services/azureSpeech';

interface ListeningComponentProps {
  onInputReceived: (text: string) => void;
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
}

const ListeningComponent: React.FC<ListeningComponentProps> = ({
  onInputReceived,
  isListening,
  setIsListening,
  language
}) => {
  const [transcribedText, setTranscribedText] = React.useState('');
  const startListening = () => {
    setIsListening(true);
    azureSpeech.startRecognition(
      language,
      // Interim results
      (text) => {
        setTranscribedText(text);
      },
      // Final result
      (text) => {
        setTranscribedText(text);
        onInputReceived(text);
      },
      // Error handling
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    );
  };

  const stopListening = () => {
    setIsListening(false);
    azureSpeech.stopRecognition();
    if (transcribedText) {
      onInputReceived(transcribedText);
      setTranscribedText('');
    }
  };

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <p>{transcribedText}</p>
    </div>
  );
};
export default ListeningComponent;
