Legal_SaaS_Project/
├── README.md
├── docker-compose.yml
├── .env  
├── backend/
│ ├── .dockerignore
│ ├── .gitignore
│ ├── Dockerfile
| |── railway.json
│ ├── requirements.txt
│ ├── src/
│ ├── .env  
│ ├── **init**.py
│ ├── main.py
│ ├── ai/
│ │ ├── **init**.py
│ │ ├── schemas.py
│ │ ├── services.py
│ │ └── routes.py
│ ├── auth/
│ │ ├── **init**.py
│ │ ├── models.py
│ │ ├── schemas.py
│ │ ├── services.py
│ │ ├── dependencies.py
│ │ └── routes.py
│ ├── core/
│ │ ├── **init**.py
│ │ ├── config.py
│ │ ├── security.py
│ │ └── middleware.py
│ ├── documents/
│ │ ├── **init**.py
│ │ ├── models.py
│ │ ├── schemas.py
│ │ ├── services.py
│ │ └── routes.py
│ ├── utils/
│ │ └── helpers.py
│ ├── storage/
│ ├── local.py
│ └── s3.py
├── frontend/
│ ├── .gitignore
│ ├── Dockerfile
│ ├── jsconfig.json
│ ├── next.config.mjs
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.mjs
│ ├── tailwind.config.ts
│ ├── public/
│ └── src/
│ ├── app/
│ │ ├── layout.jsx
│ │ ├── globals.css
│ │ ├── page.jsx
│ │ ├── login/
│ │ │ └── page.jsx
│ │ ├── register/
│ │ │ └── page.jsx
│ │ ├── dashboard/
│ │ │ └── page.jsx
│ │ ├── documents/
│ │ │ ├── page.jsx
│ │ │ ├── upload/
│ │ │ │ └── page.jsx
│ │ │ └── [id]/
│ │ │ └── page.jsx
│ │ ├── ai-chat/
│ │ │ └── page.jsx
│ │ ├── settings/
│ │ │ ├── page.jsx
│ │ │ └── api-keys/
│ │ │ └── page.jsx
│ │ └── loading.jsx
│ ├── components/
│ │ ├── ui/
│ │ │ ├── button.jsx
│ │ │ ├── card.jsx
│ │ │ ├── input.jsx
│ │ │ ├── label.jsx
│ │ │ ├── tabs.jsx
│ │ │ ├── textarea.jsx
│ │ │ ├── dropdown-menu.jsx
│ │ │ ├── dialog.jsx
│ │ │ ├── avatar.jsx
│ │ │ ├── scroll-area.jsx
│ │ │ ├── spinner.jsx
│ │ │ └── badge.jsx
│ │ └── dashboard-layout.jsx
│ ├── lib/
│ │ ├── api.js
│ │ ├── auth-context.js
│ │ ├── constants.js
│ │ └── utils.js
│ └── hooks/
| ├── use-mobile.js
│ └── use-toast.js
