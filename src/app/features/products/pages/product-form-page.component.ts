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
            <mat-form-field appearance="outline"><mat-label>Location</mat-label><mat-select formControlName="location">@for (state of states; track state) {<mat-option [value]="state">{{ state }}</mat-option>}</mat-select></mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="5" formControlName="description"></textarea></mat-form-field>

          <div class="upload-block">
            <label class="upload-label">Product images
              <input type="file" multiple accept="image/*" (change)="onFilesSelected($event)" />
            </label>
            <p class="file-hint">Upload up to 5 images to help buyers see exactly what you're selling.</p>
          </div>

          <div class="preview-list">
            @if (imagePreviews().length > 0) {
              @for (image of imagePreviews(); track image) {
                <img [src]="image" alt="preview" />
              }
            }
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
  styles: [`.form-page{padding:2rem 1rem}.form-page mat-card{max-width:940px;margin:0 auto;padding:2rem;border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,.08)}.page-header{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:start;margin-bottom:1.75rem}.page-title{display:flex;gap:1rem;align-items:center}.page-icon{font-size:2.2rem;color:#1976d2}.subtitle{margin:.4rem 0 0;color:#556;font-size:1rem;max-width:720px}.status-chip{padding:.55rem 1rem;border-radius:999px;background:#e8f3ff;color:#0d47a1;font-weight:600;text-transform:uppercase;font-size:.8rem;letter-spacing:.03em;display:inline-flex;align-items:center}.status-chip.edit{background:#e8f7ed;color:#1b5e20}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}.full-width{width:100%}.upload-block{margin:1.25rem 0}.upload-label{display:inline-flex;flex-direction:column;gap:.5rem;font-weight:600;color:#333}.upload-label input{margin-top:.5rem}.file-hint{margin:.5rem 0 0;color:#606060;font-size:.95rem}.preview-list{display:flex;gap:.85rem;flex-wrap:wrap;margin:1rem 0}.preview-list img{width:110px;height:110px;object-fit:cover;border-radius:18px;box-shadow:0 8px 18px rgba(0,0,0,.09)}.actions{display:flex;justify-content:flex-end;margin-top:1.25rem}`]
})
export class ProductFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authStore = inject(AuthStore);
  readonly categories = PRODUCT_CATEGORIES;
  readonly states = INDIAN_STATES;
  readonly saving = signal(false);
  readonly imagePreviews = signal<string[]>([]);
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
        this.imagePreviews.set(product.images.map((image) => image.url));
      });
    }
  }

  onFilesSelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    Promise.all(files.map((file) => this.toDataUrl(file))).then((images) => this.imagePreviews.set(images));
  }

  submit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const payload = { ...this.form.getRawValue(), images: this.imagePreviews().map((url) => ({ url })) };
    const request$ = this.isEditMode()
      ? this.productsService.updateProduct(this.route.snapshot.paramMap.get('id') as string, payload)
      : this.productsService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Listing saved', 'Close', { duration: 2500 });
        this.router.navigate(['/my-listings']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Unable to save listing', 'Close', { duration: 2500 });
      }
    });
  }

  private toDataUrl(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  private canEdit(product: Product) {
    const user = this.authStore.user();
    return this.authStore.isAdmin() || product.seller.id === user?.id;
  }
}
