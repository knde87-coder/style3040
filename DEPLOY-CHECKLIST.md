# goodform-five.vercel.app 배포 체크리스트

- 도메인: goodform-five.vercel.app
- 한글 브랜드명: 비율좋은그사람
- 유튜브: goodform
- 현재 상태: 정적 사이트 + localStorage 운영 흐름
- 다음 서버 전환 대상: 상품(products), 주문(orders), 회원(users), 이미지(storage)

## 배포 전에 필요한 실제 연결

1. Vercel 또는 Netlify에 현재 폴더 배포
2. goodform-five.vercel.app DNS CNAME 연결
3. Firebase/Supabase 중 하나로 상품/주문 DB 연결
4. 이미지 업로드는 Storage로 이전
5. 결제사는 토스페이먼츠/이니시스/나이스페이 중 선택 후 checkout.html에 연결
6. 유튜브 채널 실제 URL 확정 후 index.html 링크 확인



