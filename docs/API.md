# BingoUs API Documentation (MVP)

이 문서는 `docs/erd/DB.md`의 스키마를 기반으로 작성된 **REST API 명세서**입니다.
모든 API는 `HTTP/1.1`을 기준이며, **Bearer Token** 인증을 기본으로 합니다.

---

## 0. 공통 사항

### Base URL
`https://api.bingous.com/v1` (예시)

### 공통 Response 형식
성공 시 `2xx` 상태 코드와 함께 데이터 반환.
실패 시 `4xx`, `5xx` 상태 코드와 함께 에러 메시지 반환.

```json
// 성공
{
  "data": { ... }
}

// 에러
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "토큰이 만료되었습니다."
  }
}
```

### 인증 (Authentication)
*   Header: `Authorization: Bearer <ACCESS_TOKEN>`

---

## 1. 인증 (Auth) & 유저 (User)

### 1.1 소셜/로컬 로그인
**POST** `/auth/login`

*   **Request**
    ```json
    {
      "provider": "local", // or "apple", "google", "kakao"
      "email": "user@example.com",
      "password": "hashed_password", // local일 경우
      "provider_token": "..." // social일 경우
    }
    ```
*   **Response**
    ```json
    {
      "data": {
        "accessToken": "ey...",
        "refreshToken": "ey...",
        "user": {
          "id": "01HQ...",
          "displayName": "Alex",
          "status": "active"
        }
      }
    }
    ```

### 1.2 내 정보 조회
**GET** `/users/me`

*   **Response**
    ```json
    {
      "data": {
        "id": "01HQ...",
        "publicId": "01HQ...",
        "displayName": "Alex",
        "email": "alex@example.com",
        "coupleId": "01HQ..." // 커플 연결 안되어있으면 null
      }
    }
    ```

---

## 2. 커플 (Couples)

### 2.1 커플 생성 (초대 코드 발급)
**POST** `/couples`

*   **Request**
    ```json
    {
      "name": "Alex & Sarah",
      "anniversaryDate": "2023-01-01"
    }
    ```
*   **Response**
    ```json
    {
      "data": {
        "coupleId": "01HQ...",
        "inviteCode": "A1B2C3" // 24시간 유효
      }
    }
    ```

### 2.2 초대 코드로 연결
**POST** `/couples/join`

*   **Request**
    ```json
    {
      "inviteCode": "A1B2C3"
    }
    ```
*   **Response** (`200 OK`)

---

## 3. 홈 (Home) & 데일리 질문 (Daily Connection)

### 3.1 홈 대시보드 (Aggregation)
**GET** `/home`
*   **설명**: 메인 화면 진입 시 필요한 데이터를 한 번에 로딩 (성능 최적화).
*   **Response**
    ```json
    {
      "data": {
        "couple": {
          "name": "Alex & Sarah",
          "dDay": 365,
          "backgroundImageUrl": "..."
        },
        "dailyQuestion": {
          "id": 105,
          "question": "What's one thing you appreciate about our relationship?",
          "myAnswer": null,
          "partnerAnswer": { "answered": true } // 내용은 답변 전까지 숨김 처리 가능
        },
        "unreadNotifications": 3
      }
    }
    ```

### 3.2 데일리 질문 답변하기
**POST** `/daily-questions/{questionId}/answers`

*   **Request**
    ```json
    {
      "answer": "I love how we always support each other."
    }
    ```

### 3.3 데일리 답변 조회 (상세)
**GET** `/daily-questions/{questionId}/answers`
*   **Response**
    ```json
    {
      "data": {
        "question": "...",
        "answers": [
          { "userId": "...", "answer": "...", "createdAt": "..." },
          { "userId": "...", "answer": "...", "createdAt": "..." }
        ]
      }
    }
    ```

---

## 4. 커뮤니티 (Feed: Photo, Diary, Reflection)

### 4.1 피드 목록 조회
**GET** `/community/posts`

*   **Query Params**
    *   `category`: `photo` | `diary` | `reflection` (생략 시 전체)
    *   `cursor`: 마지막 조회한 post의 `id` (Pagination)
    *   `limit`: `20`
*   **Response**
    ```json
    {
      "data": {
        "posts": [
          {
            "id": "01HQ...",
            "category": "photo",
            "title": "Beach Trip",
            "content": "So much fun!",
            "images": [{ "url": "...", "width": 800, "height": 600 }],
            "createdAt": "2024-01-20T10:00:00Z",
            "author": { "id": "...", "displayName": "Alex" }
          },
          {
            "id": "01HQ...",
            "category": "reflection",
            "topic": "Communication",
            "title": "Sorry about yesterday",
            "receipts": { "partnerRead": false } // 반성문 읽음 상태
          }
        ],
        "nextCursor": "01HQ..."
      }
    }
    ```

### 4.2 글 작성
**POST** `/community/posts`

*   **Request**
    ```json
    {
      "category": "diary", // photo, reflection
      "title": "Morning Coffee",
      "content": "The smell of fresh coffee...",
      "eventDate": "2024-07-12",
      "topic": null, // reflection일 경우 필수 (예: "Arguments")
      "assetIds": [101, 102] // 미리 업로드된 asset ID 리스트
    }
    ```

### 4.3 반성문 읽음 처리
**POST** `/community/posts/{postId}/read`
*   **설명**: 상대방이 반성문을 열었을 때 호출. `receipts` 테이블 업데이트.

---

## 5. 미션 (Missions)

### 5.1 미션 목록 조회
**GET** `/missions`

*   **Query Params**
    *   `status`: `open` | `completed`
    *   `month`: `2024-07` (월별 조회 시)
*   **Response**
    ```json
    {
      "data": [
        {
          "id": "01HQ...",
          "title": "Cook a new recipe",
          "description": "Make pasta from scratch.",
          "deadline": "2024-07-20",
          "reward": "Loser does dishes",
          "status": "open",
          "myCompletionStatus": false
        }
      ]
    }
    ```

### 5.2 미션 생성
**POST** `/missions`

*   **Request**
    ```json
    {
      "title": "Run 5km",
      "description": "Together at the park",
      "assignedDate": "2024-07-15",
      "deadline": "2024-07-20",
      "reward": "Winner gets a massage"
    }
    ```

### 5.3 미션 완료 체크
**POST** `/missions/{missionId}/complete`
*   **Response**: 두 명이 모두 완료하면 미션 상태가 `completed`로 변경됨.

---

## 6. 캘린더 (Calendar)

### 6.1 일정 조회
**GET** `/calendar/events`

*   **Query Params**
    *   `from`: `2024-07-01`
    *   `to`: `2024-07-31`
*   **Response**
    ```json
    {
      "data": [
        {
          "id": "01HQ...",
          "title": "Lunch with Alex",
          "startAt": "2024-07-10T12:00:00Z",
          "endAt": "2024-07-10T13:00:00Z",
          "allDay": false
        }
      ]
    }
    ```

### 6.2 일정 생성
**POST** `/calendar/events`

*   **Request**
    ```json
    {
      "title": "Dinner Date",
      "startAt": "2024-07-10T18:00:00Z",
      "endAt": "2024-07-10T20:00:00Z",
      "allDay": false
    }
    ```

---

## 7. 채팅 (Chat)

### 7.1 채팅방 정보 및 메시지 조회
**GET** `/chat/messages`

*   **Query Params**
    *   `cursor`: 이전 메시지 로딩용
*   **Response**
    ```json
    {
      "data": {
        "roomId": "01HQ...",
        "messages": [
          {
            "id": "01HQ...",
            "text": "Hiking sounds amazing!",
            "senderId": "...",
            "createdAt": "2024-07-10T09:00:00Z",
            "type": "text"
          }
        ]
      }
    }
    ```

### 7.2 메시지 전송
**POST** `/chat/messages`

*   **Request**
    ```json
    {
      "text": "Yes, let's go!",
      "clientMessageId": "uuid-v4...", // 중복 전송 방지
      "type": "text" // or image
    }
    ```

---

## 8. 파일 업로드 (Assets)

### 8.1 업로드 URL 요청 (Presigned URL)
**POST** `/assets/presign`

*   **Request**
    ```json
    {
      "filename": "photo.jpg",
      "mimeType": "image/jpeg",
      "usage": "community" // or profile, chat
    }
    ```
*   **Response**
    ```json
    {
      "data": {
        "uploadUrl": "https://s3.aws...",
        "publicUrl": "https://cdn.bingous.com/...",
        "assetId": 105 // 업로드 완료 후 이 ID를 다른 API에 사용
      }
    }
    ```
