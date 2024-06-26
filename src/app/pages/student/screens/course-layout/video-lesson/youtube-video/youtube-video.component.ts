import { Component, Input } from '@angular/core';
import { SafeUrlPipe } from '../../../../../../shared/Pipes/safe-url.pipe';

@Component({
  selector: 'app-youtube-video',
  standalone: true,
  imports: [SafeUrlPipe],
  templateUrl: './youtube-video.component.html',
  styleUrl: './youtube-video.component.scss',
})
export class YoutubeVideoComponent {
  @Input() videoId: string = '';
}
