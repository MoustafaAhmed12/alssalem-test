import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { TutorilsStudentsService } from '../../../services/tutorils-students.service';
import { AuthService } from '../../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { YoutubeVideoComponent } from './youtube-video/youtube-video.component';
import { SafeUrlPipe } from '../../../../../shared/Pipes/safe-url.pipe';

export interface VideoDetails {
  chapterName: string;
  videUrl: string;
  attachment: Attachment;
  isOpen: boolean;
}

export interface Attachment {
  id: number;
  name: string;
  link: string;
}

@Component({
  selector: 'app-video-lesson',
  standalone: true,
  imports: [NgClass, YoutubeVideoComponent, SafeUrlPipe],
  templateUrl: './video-lesson.component.html',
  styleUrl: './video-lesson.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideoLessonComponent implements OnInit {
  tutorilsStudentsService = inject(TutorilsStudentsService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  isAuth: boolean = false;
  currentUser: any;
  videoDetails!: VideoDetails;
  isLoading = signal<boolean>(false);
  isYoutube = signal<boolean>(false);
  videoId: string = '';
  videoURL: string = '';

  chapterId: number = 0;
  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    this.currentUser = this.authService.currentUser()?.userDto;
    this.route.params.subscribe((params) => {
      this.chapterId = parseInt(params['id']);
      if (this.chapterId && this.isAuth === true) {
        this.fetchStudentVideo({
          chapterId: this.chapterId,
          userId: this.currentUser.id,
        });
      }
      if (this.isAuth === false) {
        this.fetchStudentVideo({
          chapterId: this.chapterId,
          userId: 0,
        });
      }
    });
  }

  fetchStudentVideo(chapterIdAndUserId: any): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService.getStudentVideo(chapterIdAndUserId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.videoDetails = result as VideoDetails;
          this.isYoutube.set(this.checkUrl(this.videoDetails.videUrl));

          if (this.isYoutube() === true) {
            this.videoId = this.getVideoIdFromUrl(this.videoDetails.videUrl);
          } else {
            this.videoId = this.getVideoIdFromUrlGoogle(
              this.videoDetails.videUrl
            );
            this.videoURL = `https://drive.google.com/file/d/${this.videoId}/preview`;
          }
          this.isLoading.update((v) => (v = false));
        } else {
          this.isLoading.update((v) => (v = false));
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
      },
    });
  }

  isYoutubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  }

  checkUrl(url: string): boolean {
    return this.isYoutubeUrl(url);
  }

  getVideoIdFromUrl(url: string): string {
    // Example url: 'https://www.youtube.com/watch?v=pP-cFVySzXo&ab_channel=AlssalemQudrate'
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return videoId.substring(0, ampersandPosition);
    }
    return videoId;
  }

  getVideoIdFromUrlGoogle(url: string): string {
    // Example function to extract video ID from Google Drive URL
    // Parse the video ID from the Google Drive URL
    let match = /\/file\/d\/([a-zA-Z0-9_-]+)\//.exec(url);
    return match ? match[1] : '';
  }
}
