
export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance with female voice
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and select a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.pitch = 1.2; // Slightly higher pitch for more feminine voice
    utterance.rate = 1.0; // Normal speaking rate
    
    window.speechSynthesis.speak(utterance);
  }
};
