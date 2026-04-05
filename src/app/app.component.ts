import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Soroban';
  digitCount: number = 4;
  num1: number = 0;
  num2: number = 0;
  operator: string = '+';
  result: number = 0;
  showResult: boolean = false;

  ngOnInit() {
    this.generateProblem();
  }

  generateProblem() {
    if (this.digitCount < 1) this.digitCount = 1;
    
    const min = Math.pow(10, this.digitCount - 1);
    const max = Math.pow(10, this.digitCount) - 1;

    this.num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    this.num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Choose operator randomly
    this.operator = Math.random() > 0.5 ? '+' : '-';

    // For subtraction, ensure result is non-negative for better practice
    if (this.operator === '-' && this.num1 < this.num2) {
      [this.num1, this.num2] = [this.num2, this.num1];
    }

    this.result = this.operator === '+' ? this.num1 + this.num2 : this.num1 - this.num2;
    this.showResult = false;

    // Speak the new problem
    const opText = this.operator === '+' ? 'mais' : 'menos';
    this.speak(`${this.num1}, ${opText}, ${this.num2}`);
  }

  toggleResult() {
    this.showResult = !this.showResult;
    if (this.showResult) {
      this.speak(`O resultado é ${this.result}`);
    }
  }

  private speak(text: string) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a Brazilian Portuguese voice
      const preferredVoice = voices.find(v => v.lang.includes('pt-BR')) || voices.find(v => v.lang.includes('pt'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  }
}
