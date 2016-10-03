from backend.backend.settings.base import *

DEBUG = False

FRONTEND_DEV = True
FRONTEND_ENV = ('' if FRONTEND_DEV else 'dist')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(FRONTEND_DIR, FRONTEND_ENV, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATICFILES_DIRS = [
    os.path.join(FRONTEND_DIR, FRONTEND_ENV, 'static'),
]

if FRONTEND_DEV:
    STATICFILES_DIRS.insert(0, os.path.join(FRONTEND_DIR, '.tmp'))