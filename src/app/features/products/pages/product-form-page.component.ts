import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_CATEGORIES } from '../../../shared/constants/categories';
import { INDIAN_STATES } from '../../../shared/constants/indian-states';
import { Product } from '../../../shared/models/product.models';
import { ImageService } from '../../../shared/services/image.service';
import { AuthStore } from '../../auth/data/auth.store';
import { ProductsService } from '../data/products.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <section class="form-page">
      <mat-card>
        <div class="page-header">
          <div class="page-title">
            <mat-icon class="page-icon">inventory_2</mat-icon>
            <div>
              <h1>{{ isEditMode() ? 'Edit listing' : 'Sell a product' }}</h1>
              <p class="subtitle">
                {{ isEditMode() ? 'Update your listing so buyers see the latest details.' : 'Create a new listing and connect with buyers quickly.' }}
              </p>
            </div>
          </div>
          <div class="status-chip" [class.edit]="isEditMode()">
            {{ isEditMode() ? 'Edit mode' : 'New listing' }}
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid">
            <mat-form-field appearance="outline"><mat-label>Title</mat-label><input matInput formControlName="title" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Price</mat-label><input matInput type="number" formControlName="price" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Category</mat-label><mat-select formControlName="category">@for (category of categories; track category.value) {<mat-option [value]="category.value">{{ category.label }}</mat-option>}</mat-select></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Condition</mat-label><mat-select formControlName="condition"><mat-option value="new">New</mat-option><mat-option value="like-new">Like New</mat-option><mat-option value="good">Good</mat-option><mat-option value="fair">Fair</mat-option></mat-select></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Location</mat-label><mat-select formControlName="location" panelClass="location-select-panel">@for (state of states; track state) {<mat-option [value]="state">{{ state }}</mat-option>}</mat-select></mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="5" formControlName="description"></textarea></mat-form-field>

          <div class="upload-section">
            <div class="upload-block">
              <label class="upload-label">
                <input #fileInput type="file" multiple accept="image/*" (change)="onFilesSelected($event)" />
                <span class="upload-icon-wrap">
                  <mat-icon>add_photo_alternate</mat-icon>
                </span>
                <span class="upload-title">Upload product images</span>
                <span class="upload-subtitle">Choose photos from your device</span>
              </label>
              <p class="file-hint">Upload up to 5 high-quality images. Max 5MB per image.</p>
            </div>

            @if (uploadError()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ uploadError() }}</span>
              </div>
            }

            @if (imagePreviews().length > 0) {
              <div class="image-count">
                {{ imagePreviews().length }} of 5 images
              </div>
            }

            <div class="preview-list">
              @for (image of imagePreviews(); track image.url; let idx = $index) {
                <div class="preview-item">
                  <img [src]="image.url" [alt]="'preview-' + idx" />
                  <button type="button" class="remove-btn" mat-icon-button (click)="removeImage(idx)" [attr.aria-label]="'Remove image ' + (idx + 1)">
                    <mat-icon>close</mat-icon>
                  </button>
                  @if (idx === 0) {
                    <span class="primary-badge">Primary</span>
                  }
                </div>
              }
            </div>
          </div>

          <div class="actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
              @if (saving()) { <mat-spinner diameter="20" /> } @else { {{ isEditMode() ? 'Update listing' : 'Publish listing' }} }
            </button>
          </div>
        </form>
      </mat-card>
    </section>
  `,
  styles: [`.form-page{padding:2rem 1rem}.form-page mat-card{max-width:940px;margin:0 auto;padding:2rem;border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,.08)}.page-header{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:start;margin-bottom:1.75rem}.page-title{display:flex;gap:1rem;align-items:center}.page-icon{font-size:2.2rem;color:#1976d2}.subtitle{margin:.4rem 0 0;color:#556;font-size:1rem;max-width:720px}.status-chip{padding:.55rem 1rem;border-radius:999px;background:#e8f3ff;color:#0d47a1;font-weight:600;text-transform:uppercase;font-size:.8rem;letter-spacing:.03em;display:inline-flex;align-items:center}.status-chip.edit{background:#e8f7ed;color:#1b5e20}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}.full-width{width:100%}:host ::ng-deep .mat-mdc-select-value,:host ::ng-deep .mat-mdc-select-arrow{color:#111827}:host ::ng-deep .mat-mdc-form-field-label{color:#374151}.upload-section{margin:1.25rem 0;padding:1.25rem;border:2px dashed #94a3b8;border-radius:12px;background:#f8fafc}.upload-block{margin-bottom:1rem}.upload-label{display:flex;min-height:150px;flex-direction:column;align-items:center;justify-content:center;gap:.55rem;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#0f172a;cursor:pointer;text-align:center;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}.upload-label:hover{border-color:#1976d2;background:#f0f7ff;box-shadow:0 10px 24px rgba(25,118,210,.12)}.upload-label input{display:none}.upload-icon-wrap{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:#e3f2fd;color:#0d47a1}.upload-icon-wrap mat-icon{font-size:1.8rem;width:1.8rem;height:1.8rem}.upload-title{font-weight:700;font-size:1rem}.upload-subtitle{font-size:.9rem;color:#475569}.file-hint{margin:.75rem 0 0;color:#475569;font-size:.95rem}.error-message{display:flex;align-items:center;gap:.75rem;padding:.875rem 1rem;background:#fee2e2;color:#991b1b;border-radius:8px;margin:1rem 0;font-weight:500}.error-message mat-icon{font-size:1.25rem}.image-count{padding:.5rem 0;color:#334155;font-size:.9rem;font-weight:700}.preview-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem;margin:1rem 0}.preview-item{position:relative;aspect-ratio:4/3;border-radius:10px;overflow:hidden;box-shadow:0 8px 22px rgba(15,23,42,.16);background:#f1f5f9;border:1px solid #e2e8f0}.preview-item img{width:100%;height:100%;object-fit:cover;display:block}.remove-btn{position:absolute;top:.4rem;right:.4rem;width:32px;height:32px;border-radius:50%;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;opacity:1;box-shadow:0 4px 10px rgba(0,0,0,.24)}.remove-btn mat-icon{font-size:1rem;width:1rem;height:1rem}.primary-badge{position:absolute;bottom:.5rem;left:.5rem;background:#047857;color:#fff;padding:.3rem .55rem;border-radius:4px;font-size:.72rem;font-weight:700}.actions{display:flex;justify-content:flex-end;margin-top:1.25rem}::ng-deep .location-select-panel{background:#fff!important;border:1px solid #cbd5e1!important;box-shadow:0 18px 38px rgba(15,23,42,.2)!important}::ng-deep .location-select-panel .mat-mdc-option{color:#111827!important;background:#fff!important;min-height:44px!important}::ng-deep .location-select-panel .mat-mdc-option:hover,::ng-deep .location-select-panel .mat-mdc-option.mdc-list-item--selected{background:#e8f3ff!important;color:#0d47a1!important}::ng-deep .location-select-panel .mdc-list-item__primary-text{color:inherit!important}@media(max-width:620px){.form-page mat-card{padding:1rem}.upload-section{border:1px solid #94a3b8}.preview-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}}`]
})
export class ProductFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly imageService = inject(ImageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authStore = inject(AuthStore);
  readonly categories = PRODUCT_CATEGORIES;
  readonly states = INDIAN_STATES;
  readonly saving = signal(false);
  readonly imagePreviews = signal<Array<{ url: string; file?: File }>>([]);
  readonly uploadError = signal('');
  readonly isEditMode = signal(!!this.route.snapshot.paramMap.get('id'));

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    condition: ['good', Validators.required],
    location: ['', Validators.required]
  });

  constructor() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.getProductById(productId).subscribe((product) => {
        if (!product) {
          this.snackBar.open('Product not found', 'Close', { duration: 2500 });
          this.router.navigate(['/']);
          return;
        }

        if (!this.canEdit(product)) {
          this.snackBar.open('Only the seller or an admin can edit this listing.', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
          return;
        }

        this.form.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          condition: product.condition,
          location: product.location
        });
        this.imagePreviews.set(product.images.map((image) => ({ url: image.url })));
      });
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    if (files.length === 0) return;

    this.uploadError.set('');
    const currentCount = this.imagePreviews().length;
    
    // Validate file count
    const countError = this.imageService.validateFileCount(currentCount, files.length);
    if (countError) {
      this.uploadError.set(countError.message);
      input.value = '';
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const error = this.imageService.validateFile(file);
      if (error) {
        this.uploadError.set(error.message);
        input.value = '';
        return;
      }
      validFiles.push(file);
    }

    // Convert to data URLs and add to previews
    Promise.all(validFiles.map((file) => this.imageService.toDataUrl(file))).then((dataUrls) => {
      const newPreviews = dataUrls.map((url, idx) => ({ url, file: validFiles[idx] }));
      this.imagePreviews.set([...this.imagePreviews(), ...newPreviews]);
      input.value = '';
    }).catch(() => {
      this.uploadError.set('Failed to process images. Please try again.');
      input.value = '';
    });
  }

  removeImage(index: number) {
    const updated = this.imagePreviews().filter((_, idx) => idx !== index);
    this.imagePreviews.set(updated);
  }

  submit() {
    if (this.form.invalid || this.imagePreviews().length === 0) {
      if (this.imagePreviews().length === 0) {
        this.uploadError.set('Please upload at least one image.');
      }
      return;
    }

    this.saving.set(true);
    const payload = { 
      ...this.form.getRawValue(), 
      images: this.imagePreviews().map((preview) => ({ url: preview.url })) 
    };
    const request$ = this.isEditMode()
      ? this.productsService.updateProduct(this.route.snapshot.paramMap.get('id') as string, payload)
      : this.productsService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Listing saved successfully!', 'Close', { duration: 2500 });
        this.router.navigate(['/my-listings']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Unable to save listing. Please try again.', 'Close', { duration: 2500 });
      }
    });
  }

  private canEdit(product: Product): boolean {
    const user = this.authStore.user();
    const isOwner = user?.id === product.seller.id;
    const isAdmin = user?.role === 'admin';
    return isOwner || isAdmin;
  }
}
