import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-performances',
  imports: [MatTooltip, NgClass],
  templateUrl: './performances.html',
  styleUrl: './performances.css',
})
export class Performances {
  @ViewChild('videoPlayer1') videoPlayer1!: ElementRef;
  @ViewChild('videoPlayer2') videoPlayer2!: ElementRef;
  @ViewChild('videoPlayer3') videoPlayer3!: ElementRef;
  @ViewChild('videoPlayer4') videoPlayer4!: ElementRef;
  showVideo:boolean[] = [false, false, false, false];

  playVideo(index: number): void {
    this.showVideo[index] = true;
    switch (index) {
      case 0:
      this.videoPlayer1.nativeElement.play();
      break;
      case 1:
      this.videoPlayer2.nativeElement.play();
      break;
      case 2:
      this.videoPlayer3.nativeElement.play();
      break;
      case 3:
      this.videoPlayer4.nativeElement.play();
      break;
    }
    
  }

  pauseVideo(index: number): void {
    this.showVideo[index] = false;
    switch (index) {
      case 0:
        const video1:HTMLVideoElement = this.videoPlayer1.nativeElement;
        video1.pause();
        video1.currentTime = 0;
      break;
      case 1:
        const video2:HTMLVideoElement = this.videoPlayer2.nativeElement;
        video2.pause();
        video2.currentTime = 0;
      break;
      case 2:
        const video3:HTMLVideoElement = this.videoPlayer3.nativeElement;
        video3.pause();
        video3.currentTime = 0;
      break;
      case 3:
        const video4:HTMLVideoElement = this.videoPlayer4.nativeElement;
        video4.pause();
        video4.currentTime = 0;
      break;
    }
    
  }
}
