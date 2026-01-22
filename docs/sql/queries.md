# BingoUs SQL Queries by Feature

이 문서는 `docs/erd/DB.md`의 스키마와 `docs/API.md`의 API 기능을 구현하기 위한 **SQL 쿼리 모음**입니다.
각 섹션은 특정 기능(Feature) 단위로 구성되어 있으며, 관련된 테이블과 API 엔드포인트를 명시합니다.

---

## 1. 인증 (Auth) & 유저 (User)

### 기능: 로그인 및 사용자 확인
*   **API**: `POST /auth/login`
*   **Tables**: `users`

**SQL: 이메일로 사용자 조회 (로그인 시)**
```sql
SELECT id, public_id, password_hash, status, display_name
FROM users
WHERE email = ? AND provider = 'local';
```

**SQL: 사용자 생성 (회원가입)**
```sql
INSERT INTO users (public_id, email, password_hash, provider, display_name, status)
VALUES (?, ?, ?, 'local', ?, 'active');
```

**SQL: 로그인 시간 업데이트**
```sql
UPDATE users SET last_seen_at = NOW(3) WHERE id = ?;
```

---

### 기능: 내 정보 조회
*   **API**: `GET /users/me`
*   **Tables**: `users`, `couple_members`, `couples`

**SQL: 사용자 및 커플 정보 조회**
```sql
SELECT 
  u.id, u.public_id, u.display_name, u.email,
  c.public_id AS couple_public_id
FROM users u
LEFT JOIN couple_members cm ON u.id = cm.user_id
LEFT JOIN couples c ON cm.couple_id = c.id
WHERE u.id = ?;
```

---

## 2. 커플 (Couples)

### 기능: 커플 생성 및 초대 코드 발급
*   **API**: `POST /couples`
*   **Tables**: `couples`, `couple_members`, `couple_invites`

**SQL: 커플 생성**
```sql
INSERT INTO couples (public_id, name, anniversary_date)
VALUES (?, ?, ?);
```

**SQL: 생성자를 커플 멤버로 등록 (Admin)**
```sql
INSERT INTO couple_members (couple_id, user_id, role)
VALUES (?, ?, 'admin');
```

**SQL: 초대 코드 생성**
```sql
INSERT INTO couple_invites (couple_id, inviter_user_id, code, expires_at)
VALUES (?, ?, ?, DATE_ADD(NOW(3), INTERVAL 24 HOUR));
```

---

### 기능: 초대 코드로 커플 연결
*   **API**: `POST /couples/join`
*   **Tables**: `couple_invites`, `couple_members`

**SQL: 유효한 초대 코드 조회**
```sql
SELECT id, couple_id 
FROM couple_invites 
WHERE code = ? AND status = 'active' AND expires_at > NOW(3);
```

**SQL: 멤버 추가 (연결)**
```sql
INSERT INTO couple_members (couple_id, user_id, role)
VALUES (?, ?, 'member');
```

**SQL: 초대 코드 사용 처리**
```sql
UPDATE couple_invites 
SET status = 'accepted', accepted_by_user_id = ?, accepted_at = NOW(3)
WHERE id = ?;
```

---

## 3. 홈 (Home) & 데일리 질문

### 기능: 홈 대시보드 데이터 조회
*   **API**: `GET /home`
*   **Tables**: `couples`, `daily_questions`, `daily_answers`, `notifications`

**SQL: 커플 정보 조회 (D-Day 계산용)**
```sql
SELECT name, anniversary_date, DATEDIFF(NOW(), anniversary_date) + 1 AS d_day
FROM couples
WHERE id = ?;
```

**SQL: 오늘의 데일리 질문 조회**
```sql
SELECT id, question_text 
FROM daily_questions 
WHERE published_date = CURRENT_DATE();
```

**SQL: 나와 파트너의 답변 상태 조회**
```sql
SELECT 
  user_id, 
  (CASE WHEN user_id = ? THEN answer_text ELSE NULL END) AS my_answer,
  1 AS answered
FROM daily_answers
WHERE couple_id = ? AND question_id = ?;
```

**SQL: 읽지 않은 알림 개수**
```sql
SELECT COUNT(*) 
FROM notifications 
WHERE user_id = ? AND is_read = 0;
```

---

### 기능: 데일리 질문 답변
*   **API**: `POST /daily-questions/{questionId}/answers`
*   **Tables**: `daily_answers`

**SQL: 답변 등록 (Upsert)**
```sql
INSERT INTO daily_answers (couple_id, question_id, user_id, answer_text)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE answer_text = VALUES(answer_text);
```

---

## 4. 커뮤니티 (Feed)

### 기능: 피드 목록 조회 (Pagination)
*   **API**: `GET /community/posts`
*   **Tables**: `community_posts`, `community_post_assets`, `community_post_receipts`, `users`

**SQL: 포스트 목록 조회**
```sql
SELECT 
  p.id, p.public_id, p.category, p.title, p.topic, p.content, p.event_date, p.created_at,
  u.display_name AS author_name,
  (SELECT GROUP_CONCAT(a.cdn_url ORDER BY pa.sort_order) 
   FROM community_post_assets pa 
   JOIN assets a ON pa.asset_id = a.id 
   WHERE pa.post_id = p.id) AS image_urls,
  r.is_read AS partner_read_status
FROM community_posts p
JOIN users u ON p.author_user_id = u.id
LEFT JOIN community_post_receipts r ON p.id = r.post_id AND r.target_user_id = ?
WHERE p.couple_id = ? 
  AND (? IS NULL OR p.category = ?) -- 카테고리 필터
  AND (? IS NULL OR p.id < ?)       -- 커서 페이징
ORDER BY p.created_at DESC, p.id DESC
LIMIT ?;
```

---

### 기능: 글 작성
*   **API**: `POST /community/posts`
*   **Tables**: `community_posts`, `community_post_assets`, `community_post_receipts`

**SQL: 포스트 생성**
```sql
INSERT INTO community_posts (public_id, couple_id, author_user_id, category, title, topic, content, event_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```

**SQL: 이미지 연결 (반복 실행)**
```sql
INSERT INTO community_post_assets (post_id, asset_id, sort_order)
VALUES (?, ?, ?);
```

**SQL: 반성문일 경우 상대방 읽음 처리 row 생성 (초기값 안읽음)**
```sql
-- category가 'reflection'일 때만
INSERT INTO community_post_receipts (post_id, target_user_id)
SELECT ?, cm.user_id 
FROM couple_members cm 
WHERE cm.couple_id = ? AND cm.user_id != ?;
```

---

### 기능: 반성문 읽음 처리
*   **API**: `POST /community/posts/{postId}/read`
*   **Tables**: `community_post_receipts`

**SQL: 읽음 업데이트**
```sql
UPDATE community_post_receipts
SET is_read = 1, read_at = NOW(3)
WHERE post_id = ? AND target_user_id = ?;
```

---

## 5. 미션 (Missions)

### 기능: 미션 목록 조회
*   **API**: `GET /missions`
*   **Tables**: `missions`, `mission_completions`

**SQL: 미션 목록 및 내 완료 여부 조회**
```sql
SELECT 
  m.id, m.public_id, m.title, m.description, m.deadline, m.reward, m.status,
  (CASE WHEN mc.id IS NOT NULL THEN 1 ELSE 0 END) AS my_completion_status
FROM missions m
LEFT JOIN mission_completions mc ON m.id = mc.mission_id AND mc.user_id = ?
WHERE m.couple_id = ?
  AND (? IS NULL OR m.status = ?)
ORDER BY m.deadline ASC;
```

---

### 기능: 미션 생성
*   **API**: `POST /missions`
*   **Tables**: `missions`

**SQL: 미션 등록**
```sql
INSERT INTO missions (public_id, couple_id, title, description, assigned_date, deadline, reward, created_by_user_id, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open');
```

---

### 기능: 미션 완료 체크
*   **API**: `POST /missions/{missionId}/complete`
*   **Tables**: `mission_completions`, `missions`, `couple_members`

**SQL: 완료 처리**
```sql
INSERT IGNORE INTO mission_completions (mission_id, user_id)
VALUES (?, ?);
```

**SQL: 두 명 모두 완료했는지 확인 후 미션 상태 업데이트**
```sql
UPDATE missions m
SET status = 'completed', completed_at = NOW(3)
WHERE id = ? 
  AND (SELECT COUNT(*) FROM mission_completions mc WHERE mc.mission_id = m.id) >= 2;
```

---

## 6. 캘린더 (Calendar)

### 기능: 일정 조회 (월별)
*   **API**: `GET /calendar/events`
*   **Tables**: `calendar_events`

**SQL: 기간 내 일정 조회**
```sql
SELECT public_id, title, start_at, end_at, all_day
FROM calendar_events
WHERE couple_id = ?
  AND end_at >= ? AND start_at <= ? -- 조회 기간 (from, to) 겹치는 일정
ORDER BY start_at ASC;
```

---

### 기능: 일정 생성
*   **API**: `POST /calendar/events`
*   **Tables**: `calendar_events`

**SQL: 일정 등록**
```sql
INSERT INTO calendar_events (public_id, couple_id, title, start_at, end_at, all_day, created_by_user_id, updated_by_user_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```

---

## 7. 채팅 (Chat)

### 기능: 메시지 목록 조회
*   **API**: `GET /chat/messages`
*   **Tables**: `chat_rooms`, `chat_messages`

**SQL: 채팅방 ID 조회 (최초 1회)**
```sql
SELECT id FROM chat_rooms WHERE couple_id = ?;
```

**SQL: 메시지 페이징 조회**
```sql
SELECT 
  public_id, sender_user_id, type, text, asset_id, created_at
FROM chat_messages
WHERE room_id = ?
  AND (? IS NULL OR id < ?) -- 커서 기반 페이징
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

---

### 기능: 메시지 전송
*   **API**: `POST /chat/messages`
*   **Tables**: `chat_messages`, `chat_rooms`

**SQL: 메시지 저장**
```sql
INSERT INTO chat_messages (public_id, room_id, sender_user_id, type, text, asset_id, client_message_id)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

**SQL: 채팅방 최근 메시지 갱신**
```sql
UPDATE chat_rooms
SET last_message_at = NOW(3), last_message_id = LAST_INSERT_ID()
WHERE id = ?;
```

---

## 8. 파일 업로드 (Assets)

### 기능: 메타데이터 저장 (업로드 완료 후)
*   **API**: (내부 로직) Presigned URL 업로드 완료 시점
*   **Tables**: `assets`

**SQL: 에셋 등록**
```sql
INSERT INTO assets (public_id, couple_id, owner_user_id, type, mime_type, size_bytes, storage_key, cdn_url, status)
VALUES (?, ?, ?, 'image', ?, ?, ?, ?, 'ready');
```

---

## 9. 알림 & 디바이스 (운영)

### 기능: 알림 생성 (시스템 내부 호출)
*   **Tables**: `notifications`

**SQL: 알림 등록**
```sql
INSERT INTO notifications (user_id, type, title, content, link_url)
VALUES (?, ?, ?, ?, ?);
```

### 기능: 디바이스 토큰 등록 (앱 실행 시)
*   **API**: `POST /devices` (가정)
*   **Tables**: `devices`

**SQL: 토큰 등록 (Upsert)**
```sql
INSERT INTO devices (user_id, fcm_token, device_type, app_version, last_active_at)
VALUES (?, ?, ?, ?, NOW(3))
ON DUPLICATE KEY UPDATE 
  last_active_at = VALUES(last_active_at),
  app_version = VALUES(app_version);
```
