import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Soroban';
  digitCount: number = 4;
  num1: number = 0;
  num2: number = 0;
  operator: string = '+';
  result: number = 0;
  showResult: boolean = false;

  // Voice Settings
  isAudioEnabled: boolean = true;
  speechRate: number = 1.0;

  // New Training Settings
  operatorMode: 'both' | 'plus' | 'minus' = 'both';
  isNumbersVisible: boolean = true;

  ngOnInit() {
    this.generateProblem();
  }

  generateProblem() {
    if (this.digitCount < 1) this.digitCount = 1;

    // Dynamic digit range: N-1 to N+1
    const getDigits = () => {
      const minD = Math.max(1, this.digitCount);
      const maxD = this.digitCount + 1;
      return Math.floor(Math.random() * (maxD - minD + 1)) + minD;
    };

    const d1 = getDigits();
    const d2 = getDigits();

    this.num1 =
      Math.floor(Math.random() * (Math.pow(10, d1) - Math.pow(10, d1 - 1))) +
      Math.pow(10, d1 - 1);
    this.num2 =
      Math.floor(Math.random() * (Math.pow(10, d2) - Math.pow(10, d2 - 1))) +
      Math.pow(10, d2 - 1);

    // Choose operator based on mode
    if (this.operatorMode === 'plus') {
      this.operator = '+';
    } else if (this.operatorMode === 'minus') {
      this.operator = '-';
    } else {
      this.operator = Math.random() > 0.5 ? '+' : '-';
    }

    // For subtraction, ensure result is non-negative
    if (this.operator === '-' && this.num1 < this.num2) {
      [this.num1, this.num2] = [this.num2, this.num1];
    }

    this.result =
      this.operator === '+' ? this.num1 + this.num2 : this.num1 - this.num2;
    this.showResult = false;

    // Speak the new problem
    this.repeatProblem();
  }

  repeatProblem() {
    const opText = this.operator === '+' ? 'mais' : 'menos';
    this.speak(`${this.num1}, ${opText}, ${this.num2}`);
  }

  toggleResult() {
    if (this.showResult) {
      this.generateProblem();
    } else {
      this.showResult = true;
      this.speak(`O resultado é ${this.result}`);
    }
  }

  toggleOperatorMode() {
    const modes: ('both' | 'plus' | 'minus')[] = ['both', 'plus', 'minus'];
    const currentIndex = modes.indexOf(this.operatorMode);
    this.operatorMode = modes[(currentIndex + 1) % modes.length];
    this.generateProblem();
  }

  toggleNumbersVisibility() {
    if (this.isAudioEnabled) {
      this.isNumbersVisible = !this.isNumbersVisible;
    } else {
      this.isNumbersVisible = true;
    }
  }

  toggleAudio() {
    this.isAudioEnabled = !this.isAudioEnabled;
    if (!this.isAudioEnabled) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.isNumbersVisible = true; // Auto-disable blind mode if audio is off
    }
  }

  private speak(text: string) {
    if (this.isAudioEnabled && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      // Try to find a Brazilian Portuguese voice
      const preferredVoice =
        voices.find((v) => v.lang.includes('pt-BR')) ||
        voices.find((v) => v.lang.includes('pt'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.lang = 'pt-BR';
      utterance.rate = this.speechRate;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  }
}
