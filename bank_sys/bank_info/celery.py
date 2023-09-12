from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Установите переменную окружения для настроек Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')

# Используйте конфигурацию Django для настроек Celery
app.config_from_object('django.conf:settings')

# Автоматически обнаруживайте задачи в приложениях Django
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)