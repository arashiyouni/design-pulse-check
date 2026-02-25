# Survey Campaign Enhancement

## Overview

Enhanced the "Data Ingestion & Signals" section's Survey tab with a comprehensive campaign creation modal that includes:

1. **Survey Templates** - Pre-built question sets for common survey types
2. **Custom Question Builder** - CRUD functionality for personalized questions
3. **Question Management** - Edit, delete, and reorder survey questions
4. **Period Selection** - Configure survey timeframes

## Files Modified

### New Files Created

- `src/sections/data-ingestion-and-signals/components/SurveyCampaignModal.tsx`
  - Comprehensive modal component for survey campaign creation
  - Includes template selection, question management, and CRUD operations

### Files Updated

- `src/sections/data-ingestion-and-signals/components/SurveyManagement.tsx`
  - Replaced inline form with modal-based campaign creation
  - Simplified state management
  - Improved UX with full-featured modal

## Features

### 1. Survey Templates

Three pre-defined templates are available:

#### **NPS Survey** (Net Promoter Score)
- Rating question: "On a scale of 0-10, how likely are you to recommend working with this engineer to a colleague?"
- Follow-up text: "What is the primary reason for your score?"

#### **CSAT Survey** (Customer Satisfaction)
- Quality rating: "How satisfied are you with the overall quality of work delivered?"
- Communication rating: "How satisfied are you with communication and responsiveness?"
- Open feedback: "Additional comments or suggestions?"

#### **Feedback Survey** (General Check-in)
Includes your specific questions:
- "How is everything going so far with the team? We would like to hear if there is anything that we could do better."
- "When in need of urgent support, are you satisfied with the Ravn team response time and the way we escalate?" (Rating)
- "Is there any additional area that we could support you on?" (Text)
- "To keep the momentum, would you be open to a recurring monthly check-in?" (Multiple choice)
  - Options: "Yes, monthly check-ins work well", "No, current cadence is fine", "Let's discuss alternative timing"

#### **Custom Survey**
- Start from scratch
- Build your own question set with full CRUD capabilities

### 2. Question Management (Custom Surveys Only)

When using the custom template, managers can:

- **Add Questions**: Click "Add Question" to create new survey questions
- **Edit Questions**: Click the edit icon to modify question text inline
- **Delete Questions**: Remove unwanted questions with the trash icon
- **Question Types**:
  - Text Response (open-ended)
  - Rating (1-5 scale)
  - Multiple Choice (with custom options)

### 3. Template Preview

Each template shows:
- Question count badge
- Expandable preview to see all questions before selection
- "Preview questions" / "Hide questions" toggle

### 4. Campaign Details

Configure basic campaign information:
- **Campaign Name**: e.g., "Feb 2026 — Week 3 Pulse"
- **Period**: e.g., "2026-02" (auto-populated with current period)

## User Flow

1. **Navigate** to "Data Ingestion & Signals" section → "Surveys" tab
2. **Click** "New Campaign" button
3. **Modal Opens** with template selection
4. **Choose Template**:
   - Select pre-built template (NPS, CSAT, Feedback)
   - OR select "Custom Survey" to build from scratch
5. **Preview Questions** (Optional):
   - Click "Preview questions" to expand and review template questions
6. **Customize** (Custom surveys only):
   - Add custom questions with "Add Question" button
   - Edit or delete questions as needed
7. **Configure Campaign**:
   - Enter campaign name
   - Set period (defaults to current month)
8. **Create**: Click "Create Campaign" to save
9. **Modal Closes** and campaign is added to the list

## Technical Details

### Component Structure

```
SurveyCampaignModal
├── Header (Title + Close button)
├── Campaign Details Form
│   ├── Campaign Name input
│   └── Period input
├── Template Selection
│   ├── NPS Survey card (with preview)
│   ├── CSAT Survey card (with preview)
│   ├── Feedback Survey card (with preview)
│   └── Custom Survey card
├── Questions Section
│   ├── Question List (numbered, editable for custom)
│   └── Add Question Form (custom only)
└── Footer (Cancel + Create buttons)
```

### Types

```typescript
export type SurveyTemplate = 'custom' | 'nps' | 'csat' | 'feedback'
export type QuestionType = 'rating' | 'text' | 'multiple-choice'

export interface SurveyQuestion {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[] // for multiple-choice
}
```

### Props Interface

```typescript
interface SurveyCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: {
    name: string
    period: string
    template: SurveyTemplate
    questions: SurveyQuestion[]
  }) => void
}
```

## Styling & Design

- **Modal Design**: Full-screen overlay with centered content
- **Responsive**: Works on mobile and desktop
- **Dark Mode**: Full dark mode support
- **Color Scheme**: Teal accent (matches Design OS palette)
- **Accessibility**: Keyboard navigation, focus management, ARIA labels

## Next Steps (Future Enhancements)

1. **Question Reordering**: Drag-and-drop to reorder questions
2. **Question Branching**: Conditional logic based on previous answers
3. **Multiple Choice Builder**: UI to add/remove/edit options for multiple-choice questions
4. **Save as Template**: Allow custom surveys to be saved as reusable templates
5. **Preview Mode**: Show how the survey will look to respondents
6. **Schedule Send**: Set future date/time for automatic campaign sending
7. **Question Bank**: Library of commonly used questions to choose from
8. **Multi-language Support**: Translate surveys for international teams

## Testing Checklist

- [ ] Modal opens when "New Campaign" is clicked
- [ ] All template options are selectable
- [ ] Template questions load correctly when template is selected
- [ ] Preview toggle works for each template
- [ ] Custom survey allows adding questions
- [ ] Custom survey allows editing questions
- [ ] Custom survey allows deleting questions
- [ ] Campaign name and period validation works
- [ ] "Create Campaign" button is disabled when fields are incomplete
- [ ] Modal closes when "Cancel" or "X" is clicked
- [ ] Modal closes after successful creation
- [ ] Dark mode renders correctly
- [ ] Responsive design works on mobile/tablet

## Screenshots

The modal includes:
- ✅ Clean, modern UI matching Design OS aesthetic
- ✅ Clear visual hierarchy with sections
- ✅ Prominent template selection with icons
- ✅ Expandable question previews
- ✅ Inline question editing for custom surveys
- ✅ Numbered question list for easy reference
- ✅ Form validation with disabled states
- ✅ Smooth transitions and hover states

## Notes

- The modal uses **fixed positioning** with a semi-transparent backdrop
- Maximum height is set to **90vh** with **scrollable content area**
- Template questions are **read-only** (cannot be edited within template surveys)
- Only **custom surveys** allow question CRUD operations
- Question IDs are auto-generated using timestamps
- The component is **fully typed** with TypeScript
