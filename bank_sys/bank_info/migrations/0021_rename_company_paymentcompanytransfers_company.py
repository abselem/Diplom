# Generated by Django 4.1.7 on 2023-04-20 17:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0020_paymentcompanytransfers_company_alter_credit_sum_pog'),
    ]

    operations = [
        migrations.RenameField(
            model_name='paymentcompanytransfers',
            old_name='Company',
            new_name='company',
        ),
    ]