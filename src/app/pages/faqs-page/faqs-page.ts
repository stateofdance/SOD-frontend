import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs-page.html',
  styleUrls: ['./faqs-page.css'],
})
export class FAQsPage {
  // Signal to track which button is active
  activeButton = signal<string>('academy'); // Default to 'academy'

  // To toggle the question's expanded state
  activeQuestionIndex = signal<number | null>(null); // No active question by default

  // Method to set the active button
  setActiveButton(button: string) {
    this.activeButton.set(button); // Update the active button
  }

  // Method to toggle the question's expanded state
  toggleQuestion(index: number) {
    if (this.activeQuestionIndex() === index) {
      this.activeQuestionIndex.set(null); // Close it if already expanded
    } else {
      this.activeQuestionIndex.set(index); // Expand the clicked question
    }
  }

  // Hardcoded questions and answers for each category
  academyQuestions = [
    { question: 'Who can join your classes?', answer: 'State of Dance is open to all ages! We have specific programs for kids, teens, and adults ranging from absolute beginners to advanced levels.' },
    { question: 'What dance styles do you offer?', answer: 'We offer a variety of dance styles depending on the current program and location. Visit the Class Description page for detailed information on each style.' },
    { question: 'Do you offer private lessons?', answer: 'Yes! We offer personalized one-on-one training sessions for those looking for rapid growth or specific choreography needs.' },
    { question: 'How can I check the class schedule?', answer: 'You can check the class schedule on our website. The schedule is regularly updated to reflect new classes and times.' }
  ];

  bookingQuestions = [
    { question: 'How do I book a class?', answer: 'You can book a class by visiting our booking page and selecting your desired class and time.' },
    { question: 'What is the cancellation policy?', answer: 'Classes can be canceled up to 24 hours before the scheduled time. Late cancellations are considered consumed sessions.' },
    { question: 'Can I reschedule my class?', answer: 'Yes, you can reschedule your class with at least 24 hours notice. Please contact our support team to make arrangements.' },
    { question: 'Do you offer discounts for group bookings?', answer: 'Yes, we offer discounts for group bookings. Please contact us directly for more details on group rates.' }
  ];

  paymentsQuestions = [
    { question: 'What payment methods are accepted?', answer: 'We accept credit/debit cards, PayPal, and bank transfers for payments.' },
    { question: 'Is there a registration fee?', answer: 'Yes, there is a one-time registration fee when signing up for classes. This fee is applied to your first payment.' },
    { question: 'Do you offer refunds?', answer: 'Refunds are available for canceled classes if requested within 7 days of purchase. Terms and conditions apply.' },
    { question: 'Can I pay in installments?', answer: 'Yes, we offer installment plans for long-term programs. Please reach out to our team to discuss payment options.' }
  ];

  accountQuestions = [
    { question: 'How do I create an account?', answer: 'You can create an account by visiting our registration page and filling out the required information.' },
    { question: 'How do I reset my password?', answer: 'If you forget your password, you can reset it by clicking on the "Forgot Password" link on the login page.' },
    { question: 'How can I update my profile?', answer: 'You can update your profile information by logging into your account and navigating to the "Profile Settings" page.' },
    { question: 'How do I delete my account?', answer: 'To delete your account, please contact our customer support team with your request.' }
  ];

  // Get questions based on the active button
  get questions() {
    switch (this.activeButton()) {
      case 'academy':
        return this.academyQuestions;
      case 'booking':
        return this.bookingQuestions;
      case 'payments':
        return this.paymentsQuestions;
      case 'account':
        return this.accountQuestions;
      default:
        return [];
    }
  }
}