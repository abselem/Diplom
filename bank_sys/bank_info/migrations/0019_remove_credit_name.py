# Generated by Django 4.1.7 on 2023-04-20 17:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0018_paymentcompany_kind'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='credit',
            name='name',
        ),
    ]
