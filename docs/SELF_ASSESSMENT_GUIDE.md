# Engineer Scorecard - Self-Assessment Guide

## Overview
The Engineer Scorecard features a **floating action button (FAB)** and **multi-step wizard** for self-assessments, making it easy to add or edit your growth evaluation from anywhere on the page.

---

## How to Add a New Self-Assessment

### Quick Access via Floating Action Button (FAB)

Look for the **floating button** in the bottom-right corner of the screen:

```
                                    ┌─────────────────────┐
                                    │  ➕ Add Assessment  │ ← Pulsing animation
                                    └─────────────────────┘
```

**Two states:**
1. **No Assessment**: Shows "➕ Add Assessment" with a pulsing animation
2. **Has Assessment**: Shows "📋 Edit Assessment" (no pulse)

### Step 1: Click the Floating Button
1. Look for the **teal circular button** in the bottom-right corner
2. Click it to open the self-assessment modal
3. The modal appears with a 3-step wizard

### Alternative: Use Sidebar Navigation
1. Click **"Self-Assessment"** in the sidebar
2. Scroll to the assessment section
3. Click the floating button or interact with the inline form

### Step 2: Complete the 3-Step Wizard

The wizard breaks down the assessment into three manageable steps:

#### **Step 1: Skills Demonstrated**
- **Select up to 3 skills** you've applied during this period
- Skills include:
  - Backend Architecture
  - Frontend (React)
  - Database Design
  - API Integration
  - DevOps/CI-CD
  - Code Review
  - Mentoring
  - System Design
- **Add evidence URL** (required): Link to a PR, design doc, or other proof
- Click **"Next"** to proceed

#### **Step 2: Current Level**
- **Select your current engineering level**:
  - **Junior**: Follows tasks, needs guidance
  - **Mid**: Owns features independently
  - **Senior**: Designs systems, unblocks others
  - **Staff**: Architects solutions, mentors teams
- **Write justification** (required): Explain why you believe you're at this level based on:
  - Complexity of work you handle
  - Level of autonomy/independence
  - Impact on the team/project
- Click **"Next"** to proceed

#### **Step 3: Growth & Goals**
- **Rate your growth trajectory** (1-5 scale):
  - 1 = Declined
  - 2 = Same
  - 3 = Slight improvement
  - 4 = Strong growth
  - 5 = Significant growth
- **Specify target skill** for next period
- **Describe your plan** for developing that skill
- Click **"Submit Assessment"** to complete

### Step 3: Review Submitted Assessment
Once submitted:
- The assessment shows a **"Submitted"** badge
- You can view a summary of your responses
- The sidebar shows a ✓ checkmark indicating completion
- You can click **"Edit"** to modify your submission if needed

---

## Using the Period Selector

The new **Clockify-style period selector** makes it easy to view different time periods:

### How to Use:
1. Click the **period button** in the top-right header (shows current period like "This Week")
2. A dropdown appears with preset options:
   - **This Week** - Current week (Sun-Sat)
   - **Last Week** - Previous week
   - **This Month** - Current calendar month
   - **Last Month** - Previous calendar month
   - **Custom Range...** - For custom date selection (coming soon)

3. Click any option to switch periods
4. The entire scorecard updates to show data for that period

### Visual Indicators:
- ✓ **Check mark** shows the currently selected period
- **Date range** displayed under each option (e.g., "Feb 9 - Feb 15")
- **Highlighted** selection in teal color

---

## Key Features

### Progress Tracking
The sidebar shows your completion status:
- ✓ **Green checkmark** = Section completed
- ⚠️ **Amber warning** = Action needed (e.g., assessment not submitted)

### Navigation
- Click any section in the sidebar to jump directly to it
- Smooth scrolling for better UX
- Active section is highlighted

### Responsive Design
- Works on mobile, tablet, and desktop
- Sidebar hidden on mobile (< 1024px width)
- Tabs for pillar details adapt to screen size

---

## Tips for a Great Self-Assessment

1. **Be Specific**: Use concrete examples in your justification
2. **Provide Evidence**: Link to actual work (PRs, docs, demos)
3. **Be Honest**: Accurate self-assessment helps with growth planning
4. **Set Realistic Goals**: Choose achievable target skills for next period
5. **Update Regularly**: Complete assessments each period for best tracking

---

## Technical Implementation

### For Developers:

#### Component Structure:
```tsx
<SelfAssessmentWizard
  data={selfAssessment}           // Current assessment data or null
  period={engineer.currentPeriod} // Period identifier (YYYY-MM)
  onSubmit={handleSubmit}         // Callback when submitted
/>
```

#### Data Flow:
1. User fills out wizard steps
2. Form validates each step before allowing "Next"
3. On final submit, `onSubmit` callback fires with complete data
4. Parent component updates state/backend
5. Component switches to "submitted" view

#### State Management:
- Local state manages current step (0-2)
- Form data stored in component state
- Submitted status persists in parent data

---

## Future Enhancements

- [ ] Custom date range picker
- [ ] Save draft functionality (auto-save)
- [ ] Assessment history view
- [ ] Comparison with previous assessments
- [ ] Manager feedback integration
- [ ] Export assessment as PDF
- [ ] Email notifications for pending assessments

---

## Support

If you encounter issues or have suggestions:
1. Check the console for errors
2. Verify all required fields are filled
3. Ensure evidence URLs are valid
4. Contact your team lead or engineering manager
