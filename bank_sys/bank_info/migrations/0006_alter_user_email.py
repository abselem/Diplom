# Generated by Django 4.1.7 on 2023-04-03 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0005_alter_user_email_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
    ]
