import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductImage } from '../models/product.models';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    @if (images && images.length > 0) {
      <div class="gallery-container">
        <div class="main-image-wrapper">
          <img [src]="images[selectedIndex()].url" [alt]="'Product image ' + (selectedIndex() + 1)" class="main-image" />
          @if (images.length > 1) {
            <button class="nav-button prev" mat-icon-button (click)="previousImage()" [disabled]="selectedIndex() === 0">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button class="nav-button next" mat-icon-button (click)="nextImage()" [disabled]="selectedIndex() === images.length - 1">
              <mat-icon>chevron_right</mat-icon>
            </button>
          }
          <div class="image-counter">{{ selectedIndex() + 1 }} / {{ images.length }}</div>
        </div>

        @if (images.length > 1) {
          <div class="thumbnails">
            @for (image of images; track image.url; let idx = $index) {
              <button
                class="thumbnail"
                [class.active]="selectedIndex() === idx"
                (click)="selectImage(idx)"
                [attr.aria-label]="'Image ' + (idx + 1)"
              >
                <img [src]="image.url" [alt]="'Thumbnail ' + (idx + 1)" />
              </button>
            }
          </div>
        }
      </div>
    } @else {
      <div class="no-images">
        <mat-icon>image_not_supported</mat-icon>
        <p>No images available</p>
      </div>
    }
  `,
  styles: [`
    .gallery-container {
      display: grid;
      gap: 1rem;
    }

    .main-image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: 16px;
      background: #f1f5f9;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      color: #0f172a;
      z-index: 10;
    }

    .nav-button.prev {
      left: 1rem;
    }

    .nav-button.next {
      right: 1rem;
    }

    .nav-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .image-counter {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .thumbnails {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      padding: 0;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.2s ease;
      background: #f1f5f9;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail.active {
      border-color: #1976d2;
    }

    .thumbnail:hover {
      border-color: #94a3b8;
    }

    .no-images {
      display: grid;
      place-items: center;
      aspect-ratio: 4/3;
      gap: 1rem;
      color: #94a3b8;
      background: #f8fafc;
      border-radius: 16px;
    }

    .no-images mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    @media (max-width: 620px) {
      .gallery-container {
        gap: 0.75rem;
      }

      .main-image-wrapper {
        aspect-ratio: 4/5;
      }

      .thumbnail {
        width: 70px;
        height: 70px;
      }
    }
  `]
})
export class ImageGalleryComponent {
  @Input() images: ProductImage[] | null = null;
  readonly selectedIndex = signal(0);

  selectImage(index: number) {
    this.selectedIndex.set(index);
  }

  nextImage() {
    if (this.images && this.selectedIndex() < this.images.length - 1) {
      this.selectedIndex.update((i) => i + 1);
    }
  }

  previousImage() {
    if (this.selectedIndex() > 0) {
      this.selectedIndex.update((i) => i - 1);
    }
  }
}
