# Firebase goodform 연결 가이드

프로젝트명은 `goodform`으로 생성하세요.

## Firebase 콘솔에서 할 일

1. Firebase Console에서 `goodform` 프로젝트 생성
2. 웹 앱 추가
3. 웹 앱 설정값을 `firebase-config.js`에 입력
4. Authentication > Sign-in method에서 Email/Password 활성화
5. Firestore Database 생성
6. Storage 생성
7. Rules 탭에 `firestore.rules`, `storage.rules` 내용 반영

## 연결 후 동작

- 회원가입/로그인: Firebase Authentication + Firestore `users`
- 상품등록/수정/삭제: Firestore `products`
- 주문 저장/주문관리: Firestore `orders`
- Firebase 설정값이 없으면 기존처럼 localStorage로 임시 동작

## 권장 컬렉션

- `products`: 상품명, 가격, 색상, 사이즈, AI 모델 컷 상태, 이미지 데이터
- `orders`: 주문자, 연락처, 주소, 상품 목록, 총액, 주문 상태
- `users`: 회원 uid, 이름, 이메일, 전화번호, 마케팅 동의
