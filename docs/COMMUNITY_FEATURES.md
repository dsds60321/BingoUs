# Community Features & Data Structure

This document outlines the features and data models for the Community section of the BingoUs application.

## Overview
The Community screen allows couples to share various types of content:
1.  **Photos**: Shared album for memories.
2.  **Diary**: Daily records of events and feelings.
3.  **Missions**: Joint tasks or challenges with deadlines and rewards/penalties.
4.  **Reflections**: Apologies or reflections on arguments, requiring acknowledgement from the partner.

## Features by Category

### 1. Photos
*   **Purpose**: Share visual memories.
*   **List View**: Grid or feed of images with titles.
*   **Detail View**: Full-size image, title, description, date.
*   **Create View**: Upload image (from gallery/camera), add title, description, date.

### 2. Diary
*   **Purpose**: Detailed daily logs.
*   **List View**: List of entries with thumbnails and previews.
*   **Detail View**: Title, full content, date, attached image (optional).
*   **Create View**: Write title, content, select date, attach image.

### 3. Missions
*   **Purpose**: Track shared goals or challenges.
*   **List View**: Cards showing status (In Progress/Completed), title, deadline.
*   **Detail View**: Title, description, deadline, betting/penalty (what happens if failed/succeeded), status toggle.
*   **Create View**: Set title, description, deadline, betting terms.

### 4. Reflections (Ban-seong-mun)
*   **Purpose**: Resolve conflicts and communicate feelings sincerely.
*   **List View**: List of letters with dates and status (Unread/Read/Acknowledged).
*   **Detail View**: Title, topic (what went wrong), date, detailed explanation/apology, Partner's Confirmation button.
*   **Create View**:
    *   **Title**: Short summary.
    *   **Topic**: The core issue (e.g., "Late for date", "Forgot anniversary").
    *   **Date**: Date of incident.
    *   **Content**: "Why I was wrong" & sincere feelings.

## Data Models (JSON Structure)

### Common Fields
All items should share:
- `id`: string (unique identifier)
- `category`: 'Photos' | 'Diary' | 'Missions' | 'Reflections'
- `createdAt`: string (ISO date)
- `authorId`: string (user ID)

### Photo Item
```json
{
  "id": "p1",
  "category": "Photos",
  "title": "Beach Trip",
  "description": "Fun day in the sun.",
  "image": "https://example.com/image.jpg",
  "date": "2024-01-20"
}
```

### Diary Item
```json
{
  "id": "d1",
  "category": "Diary",
  "title": "A quiet evening",
  "description": "Long text content...",
  "image": "https://example.com/rain.jpg",
  "date": "2024-07-10"
}
```

### Mission Item
```json
{
  "id": "m1",
  "category": "Missions",
  "title": "Cook Pasta",
  "description": "Make carbonara from scratch.",
  "deadline": "2024-07-20",
  "betting": "Loser does dishes for a week",
  "status": "In Progress", // 'In Progress' | 'Completed' | 'Failed'
  "date": "2024-07-15"
}
```

### Reflection Item
```json
{
  "id": "r1",
  "category": "Reflections",
  "title": "I'm sorry for being late",
  "topic": "Punctuality",
  "content": "I realized that my lateness made you feel unimportant...",
  "date": "2024-07-12",
  "status": "Pending", // 'Pending' | 'Acknowledged'
  "partnerComment": "" // Optional response from partner
}
```
