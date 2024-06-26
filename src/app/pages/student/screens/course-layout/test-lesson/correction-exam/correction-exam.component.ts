import { CommonModule, NgClass, PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-correction-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './correction-exam.component.html',
  styleUrl: './correction-exam.component.scss',
})
export class CorrectionExamComponent implements OnInit {
  @Input() correctionExamDetails!: any;
  // defaults: confetti.Options | undefined;
  array: any[] = [
    {
      step: 'نسبة النجاح',

      bgColor: '#36b290',
    },
    {
      step: 'نسبة الفشل',

      bgColor: '#963c3d',
    },
  ];

  bgColors: string[] = [];
  ngOnInit() {
    console.log(this.correctionExamDetails);
    this.correctionExamDetails.map((e: any) => {
      e.takenTime = this.convertSeconds(e.takenTime);
    });
    if (this.correctionExamDetails === 1) {
      if (this.correctionExamDetails[0].isSuccess === true) {
        this.startConfettiAnimation();
        this.triggerConfetti();
      }
    } else {
      if (
        this.correctionExamDetails[this.correctionExamDetails.length - 1]
          .isSuccess === true
      ) {
        this.startConfettiAnimation();
        this.triggerConfetti();
      }
    }
    this.array.map((o) => {
      this.bgColors.push(o.bgColor);
    });

    this.renderChart(this.bgColors);
  }

  convertSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      secs
    )}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  renderChart(bgColors: any): void {
    const chart = new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: ['نسبة النجاح', 'نسبة الفشل'],
        datasets: [
          {
            data: [
              this.correctionExamDetails
                ? this.correctionExamDetails.length === 1
                  ? this.correctionExamDetails[0].percentage
                  : this.correctionExamDetails[
                      this.correctionExamDetails.length - 1
                    ].percentage
                : 0,
              this.correctionExamDetails
                ? this.correctionExamDetails.length === 1
                  ? 100 - this.correctionExamDetails[0].percentage
                  : 100 -
                    this.correctionExamDetails[
                      this.correctionExamDetails.length - 1
                    ].percentage
                : 0,
            ],
            backgroundColor: bgColors,
          },
        ],
      },
      options: {
        backgroundColor: '#f00',
      },
    });
  }

  startConfettiAnimation(): void {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['090', 'ff0', 'E89400', 'FFCA6C', 'FDFFB8'],
    };

    const interval = setInterval(() => {
      const timeLeft: number = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount: number = 150 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: this.randomInRange({ min: 0.1, max: 0.3 }),
          y: Math.random() - 0.2,
        },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: this.randomInRange({ min: 0.7, max: 0.9 }),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  }

  triggerConfetti(): void {
    confetti();
  }

  randomInRange({ min, max }: { min: number; max: number }): number {
    return Math.random() * (max - min) + min;
  }

  shoot(): void {
    confetti({
      // ...this.defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    });

    confetti({
      // ...this.defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'],
    });
  }

  setTimeoutShoot(): void {
    setTimeout(() => this.shoot(), 0);
    setTimeout(() => this.shoot(), 100);
    setTimeout(() => this.shoot(), 200);
  }
}
