# Generated by Django 4.1.7 on 2023-04-19 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0012_deposit_pin'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='deposit',
            name='iin',
        ),
        migrations.RemoveField(
            model_name='deposit',
            name='pin',
        ),
        migrations.AddField(
            model_name='card',
            name='pin',
            field=models.CharField(default='0000', max_length=4),
        ),
    ]