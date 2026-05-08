import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { AuthStore } from '../../auth/data/auth.store';
import { ChatService } from '../data/chat.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, MatCardModule, MatListModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  template: `
    <section class="chat-page">
      <mat-card class="threads">
        <h2>Conversations</h2>
        <mat-list>
          @for (thread of chatService.threads(); track thread.id) {
            <button mat-list-item type="button" (click)="activeThreadId.set(thread.id)">
              <span matListItemTitle>{{ thread.productTitle }}</span>
              <span matListItemLine>{{ thread.lastMessage }}</span>
            </button>
          }
        </mat-list>
      </mat-card>

      <mat-card class="messages">
        <h2>Messages</h2>
        <div class="message-list">
          @for (message of activeMessages(); track message.id) {
            <div class="bubble" [class.mine]="message.fromUserId === currentUserId()">
              <p>{{ message.text }}</p>
              <small>{{ message.createdAt | date : 'shortTime' }}</small>
            </div>
          }
        </div>
        <div class="composer">
          <mat-form-field appearance="outline"><mat-label>Type a message</mat-label><input matInput [(ngModel)]="draft" (keyup.enter)="send()" /></mat-form-field>
          <button mat-flat-button color="primary" (click)="send()">Send</button>
        </div>
      </mat-card>
    </section>
  `,
  styles: [`.chat-page{display:grid;grid-template-columns:320px 1fr;gap:1rem;padding:1rem}.threads,.messages{padding:1rem}.message-list{display:grid;gap:.75rem;min-height:320px}.bubble{max-width:70%;padding:.75rem 1rem;border-radius:18px;background:#f1f5f9}.bubble.mine{margin-left:auto;background:#dbeafe}.composer{display:flex;gap:1rem;align-items:flex-start}.composer mat-form-field{flex:1}@media(max-width:900px){.chat-page{grid-template-columns:1fr}}`]
})
export class ChatPageComponent {
  readonly chatService = inject(ChatService);
  private readonly authStore = inject(AuthStore);
  readonly currentUserId = computed(() => this.authStore.user()?.id || 'buyer-1');
  readonly activeThreadId = signal(this.chatService.threads()[0]?.id || '');
  readonly activeMessages = computed(() => this.chatService.messages().filter((message) => message.threadId === this.activeThreadId()));
  draft = '';

  send() {
    if (!this.draft.trim() || !this.activeThreadId()) return;
    this.chatService.sendMessage(this.activeThreadId(), this.currentUserId(), 'seller-1', this.draft.trim());
    this.draft = '';
  }
}
