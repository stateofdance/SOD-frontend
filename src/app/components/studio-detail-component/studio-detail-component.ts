import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the types of content blocks a section can have
type ContentBlock = 
  | { type: 'text'; value: string }
  | { type: 'list'; values: string[] };

interface StudioSection {
  title: string | null; // Nullable in case there is text before the first header
  blocks: ContentBlock[];
}

@Component({
  selector: 'app-studio-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './studio-detail-component.html',
  styleUrls: ['./studio-detail-component.css']
})
export class StudioDetailComponent implements OnInit {
  // Added some plain text to the mock data to test the new logic
  @Input() rawApiData: string = `
Welcome to our booking page! Please read the details below.

***Main Studio***
= 3 x 2.5 HP Air-Conditioners
= Aesthetic Lights
= Quality Speakers
= 50 Chairs Available

***Small Studio***
Perfect for solo or small group rehearsals
= Capacity: Up to 5 persons (Dancing)
= Rate: Only ₱395 per hour
Please note: no food inside the small studio.
  `;

  parsedSections: StudioSection[] = [];

  ngOnInit(): void {
    this.parseData();
  }

  private parseData(): void {
    const lines = this.rawApiData.split('\n');
    
    // Initialize the first section (in case there's plain text before any headers)
    let currentSection: StudioSection = { title: null, blocks: [] };

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) continue;

      // 1. Handle Headings
      if (trimmedLine.startsWith('***') && trimmedLine.endsWith('***')) {
        // Save the current section if it has any content
        if (currentSection.title !== null || currentSection.blocks.length > 0) {
          this.parsedSections.push(currentSection);
        }
        
        // Start a brand new section
        const title = trimmedLine.replace(/\*\*\*/g, '').trim();
        currentSection = { title: title, blocks: [] };
      } 
      
      // 2. Handle List Items
      else if (trimmedLine.startsWith('=')) {
        const itemText = trimmedLine.substring(1).trim();
        
        // Check if the last block we added was already a list
        const lastBlock = currentSection.blocks[currentSection.blocks.length - 1];
        
        if (lastBlock && lastBlock.type === 'list') {
          // If it is, just add to the existing list
          lastBlock.values.push(itemText);
        } else {
          // If not, create a new list block
          currentSection.blocks.push({ type: 'list', values: [itemText] });
        }
      } 
      
      // 3. Handle Plain Text
      else {
        currentSection.blocks.push({ type: 'text', value: trimmedLine });
      }
    }

    // Don't forget to push the very last section after the loop finishes
    if (currentSection.title !== null || currentSection.blocks.length > 0) {
      this.parsedSections.push(currentSection);
    }
  }
}