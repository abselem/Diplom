# Generated by Django 4.1.7 on 2023-04-20 17:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0022_remove_paymentcompanytransfers_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paymentcompanytransfers',
            name='bill',
        ),
        migrations.RemoveField(
            model_name='paymentcompanytransfers',
            name='bill_count_number',
        ),
    ]
